import express, { json, type Express, type Request, type Response } from 'express';
import { db } from './prisma/db';
import bcrypt from 'bcrypt';
import { signTokenAcesso, signTokenRefresh, verificarToken } from './utils/jwt';
import cors from 'cors'
import { auth } from './middleware/auth';

const app: Express = express();
app.use(json())
app.use(cors({
  origin: 'http://localhost:5173'
}))

app.get('/renovar-token', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.query.token as string
    console.log(refreshToken)
    const tokenBanco = await db.orm.public.Token.where({ token: refreshToken }).first()
    if (tokenBanco?.revoked) return res.status(401).json({ error: "revoked token" })

    const payload = verificarToken(refreshToken)
    if (!payload) return res.status(401).json({
      error: "invalid token"
    })
    const usuario = await db.orm.public.User.where({ id: tokenBanco?.usuarioId }).first()
    if (!usuario) return res.status(401).json({
      error: "user not found"
    })

    const tokenAcesso = signTokenAcesso({
      nome: usuario.name,
      email: usuario.email
    })

    const acessoExpiraEm = new Date()
    const acessoExpiraEm5Minutos = acessoExpiraEm.setMinutes(acessoExpiraEm.getMinutes() + 5)
    await db.orm.public.Token.create({
      token: tokenAcesso,
      type: "ACESSO",
      revoked: false,
      usuarioId: usuario.id,
      expiresAt: new Date(acessoExpiraEm5Minutos).toISOString()
    });
    return res.status(200).json(
      {
        "message": "Token de acesso renovado!",
        "data": {
          tokenAcesso,
          refreshToken,
          idUsuario: usuario.id
        }
      })
  } catch (erro: any) {
    if (erro?.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "expired refresh token"
      })
    }
    return res.status(401).json({
      error: "invalid token"
    })

  }
})

app.post("/login", async (req: Request, res: Response) => {
  const body = req.body;
  const existeUsuario = await db.orm.public.User.where({ email: body.email }).first()
  if (existeUsuario) {
    const senha = body.password
    const senhaCorreta = await bcrypt.compare(senha, existeUsuario.password)
    if (senhaCorreta) {
      const tokenAcesso = signTokenAcesso({
        nome: existeUsuario.name,
        email: existeUsuario.email
      })
      const tokenRefresh = signTokenRefresh({
        nome: existeUsuario.name,
        email: existeUsuario.email
      })

      const acessoExpiraEm = new Date()
      const acessoExpiraEm5Minutos = acessoExpiraEm.setMinutes(acessoExpiraEm.getMinutes() + 5)
      await db.orm.public.Token.create({
        token: tokenAcesso,
        type: "ACESSO",
        revoked: false,
        usuarioId: existeUsuario.id,
        expiresAt: new Date(acessoExpiraEm5Minutos).toISOString()
      });

      const refreshExpiraEm = new Date()
      const refreshExpiraEm1Dia = refreshExpiraEm.setHours(refreshExpiraEm.getHours() + 24)
      await db.orm.public.Token.create({
        token: tokenRefresh,
        type: "REFRESH",
        revoked: false,
        usuarioId: existeUsuario.id,
        expiresAt: new Date(refreshExpiraEm1Dia).toISOString()
      });

      res.status(200).json(
        {
          "message": "Usuário logado!",
          "data": {
            tokenAcesso,
            tokenRefresh,
            idUsuario: existeUsuario.id
          }
        })
    }
    res.status(401).json({ "message": "Senha incorreta!" })
  }
  res.status(401).json({ "message": "Usuário não encontrado!" })

})

app.put('/logout/:id', async (req: Request, res: Response) => {
  const idUsuario = Number(req.params.id)
  const usuario = await db.orm.public.User.where({ id: idUsuario }).first()

  if (usuario) {
    await db.orm.public.Token.where({ usuarioId: idUsuario, revoked: false }).updateAll({
      revoked: true
    })

    res.json({
      "mensagem": "Usuário deslogado com sucesso!",
    });

  }
  res.status(400).send("Usuário não encontrado!")

});

app.use(auth);

app.get('/usuarios', async (_: Request, res: Response) => {
  const users = await db.orm.public.User.select("id", "username", "email").all()

  res.json(users);
});

app.get('/usuarios/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const usuario = await db.orm.public.User.where({ id }).first()
  if (usuario) {
    res.json(usuario);
  }

  res.status(400).send("Usuário não existe!")

});

app.post('/usuario', async (req: Request, res: Response) => {
  const body = req.body;
  const hashSenha = await bcrypt.hash(body.password, 10);

  const usuario = await db.orm.public.User.create({
    email: body.email,
    name: body.name,
    password: hashSenha,
    username: body.username
  });

  res.json({
    "mensagem": "Usuário Criado!",
    "data": usuario
  });
});


app.put('/usuarios/:id', async (req: Request, res: Response) => {
  const body = req.body;
  const id = Number(req.params.id)

  const hashSenha = await bcrypt.hash(body.password, 10)
  const usuario = await db.orm.public.User.where({ id }).update({
    email: body.email,
    name: body.name,
    password: hashSenha,
    username: body.username
  });
  if (usuario) {
    res.json({
      "mensagem": "Usuário atualizado com sucesso!",
      "data": usuario
    });

  }
  res.status(400).send("Usuário não encontrado!")

});


app.delete('/usuarios/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const usuario = await db.orm.public.User.where({ id }).delete()
  if (usuario) {
    res.json({
      mensagem: "Usuário deletado",
      data: usuario
    });
  } else {
    res.status(400).send("Usuário não existe!")
  }
});

app.listen(3000, () => {
  console.log("Rodando em http://localhost:3000")
});

