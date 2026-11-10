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

app.post('/cadastro', async (req: Request, res: Response) => {
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
    "data": usuario.id
  });
});


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

app.get('/usuarios', async (_: Request, res: Response) => {
  const users = await db.orm.public.User.select("id", "username", "email").all()

  res.json(users);
});

app.use(auth);

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

app.get('/exames', async (_: Request, res: Response) => {
  const exames = await db.orm.public.Exame
    .select("id", "tipo_exame", "valor", "descricao", "resultado", "data_exame")
    .all()

  res.json(exames);
});

app.get('/exames/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const exame = await db.orm.public.Exame.where({ id }).first()
  if (exame) {
    res.json(exame);
  } else {
    res.status(400).send("Exame não existe!")
  }
});

app.post('/exame', async (req: Request, res: Response) => {
  const body = req.body;

  const exame = await db.orm.public.Exame.create({
    tipo_exame: body.tipo_exame,
    valor: String(body.valor),
    descricao: body.descricao,
    resultado: body.resultado,
    data_exame: body.data_exame,
    paciente_id: body.paciente_id
  });

  res.json({
    "mensagem": "Exame criado!",
    "data": exame
  });
});

app.put('/exames/:id', async (req: Request, res: Response) => {
  const body = req.body;
  const id = Number(req.params.id)

  const exame = await db.orm.public.Exame.where({ id }).update({
    tipo_exame: body.tipo_exame,
    valor: String(body.valor),
    descricao: body.descricao,
    resultado: body.resultado,
    data_exame: body.data_exame,
    paciente_id: body.paciente_id
  });
  if (exame) {
    res.json({
      "mensagem": "Exame atualizado com sucesso!",
      "data": exame
    });
  } else {
    res.status(400).send("Exame não encontrado!")
  }
});

app.delete('/exames/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const exame = await db.orm.public.Exame.where({ id }).delete()
  if (exame) {
    res.json({
      mensagem: "Exame deletado",
      data: exame
    });
  } else {
    res.status(400).send("Exame não existe!")
  }
});

app.get('/pacientes', async (_: Request, res: Response) => {
  const pacientes = await db.orm.public.Paciente
    .select("id", "nome", "cpf", "telefone", "email", "data_nascimento", "sexo", "alergia", "cirurgia", "peso", "altura")
    .all()

  res.json(pacientes);
});

app.get('/pacientes/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const paciente = await db.orm.public.Paciente
    .where({ id })
    .include('exame')
    .first()
  if (paciente) {
    res.json(paciente);
  } else {
    res.status(400).send("Paciente não existe!")
  }
});

app.post('/paciente', async (req: Request, res: Response) => {
  const body = req.body;

  const paciente = await db.orm.public.Paciente.create({
    nome: body.nome,
    cpf: body.cpf,
    telefone: body.telefone,
    email: body.email,
    data_nascimento: body.data_nascimento,
    sexo: body.sexo,
    alergia: body.alergia,
    cirurgia: body.cirurgia,
    peso: String(body.peso),
    altura: body.altura
  });

  res.json({
    "mensagem": "Paciente criado!",
    "data": paciente
  });
});

app.put('/pacientes/:id', async (req: Request, res: Response) => {
  const body = req.body;
  const id = Number(req.params.id)

  const paciente = await db.orm.public.Paciente.where({ id }).update({
    nome: body.nome,
    cpf: body.cpf,
    telefone: body.telefone,
    email: body.email,
    data_nascimento: body.data_nascimento,
    sexo: body.sexo,
    alergia: body.alergia,
    cirurgia: body.cirurgia,
    peso: String(body.peso),
    altura: body.altura
  });
  if (paciente) {
    res.json({
      "mensagem": "Paciente atualizado com sucesso!",
      "data": paciente
    });
  } else {
    res.status(400).send("Paciente não encontrado!")
  }
});

app.delete('/pacientes/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const paciente = await db.orm.public.Paciente.where({ id }).delete()
  if (paciente) {
    res.json({
      mensagem: "Paciente deletado",
      data: paciente
    });
  } else {
    res.status(400).send("Paciente não existe!")
  }
});

app.get('/consultas', async (_: Request, res: Response) => {
  const consultas = await db.orm.public.Consulta
    .select("id", "motivo", "data_consulta", "observacoes", "medico_responsavel_id", "paciente_id")
    .all()

  res.json(consultas);
});

app.get('/consultas/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const consulta = await db.orm.public.Consulta
    .where({ id })
    .include('paciente')
    .include('medico_responsavel', (medico) =>
      medico.select('name', 'email')
    )
    .first()
  if (consulta) {
    res.json(consulta);
  } else {
    res.status(400).send("Consulta não existe!")
  }
});

app.post('/consulta', async (req: Request, res: Response) => {
  const body = req.body;

  const consulta = await db.orm.public.Consulta.create({
    motivo: body.motivo,
    data_consulta: body.data_consulta,
    observacoes: body.observacoes,
    medico_responsavel_id: body.medico_responsavel_id,
    paciente_id: body.paciente_id
  });

  res.json({
    "mensagem": "Consulta criada!",
    "data": consulta
  });
});

app.put('/consultas/:id', async (req: Request, res: Response) => {
  const body = req.body;
  const id = Number(req.params.id)

  const consulta = await db.orm.public.Consulta.where({ id }).update({
    motivo: body.motivo,
    data_consulta: body.data_consulta,
    observacoes: body.observacoes,
    medico_responsavel_id: body.medico_responsavel_id,
    paciente_id: body.paciente_id
  });
  if (consulta) {
    res.json({
      "mensagem": "Consulta atualizada com sucesso!",
      "data": consulta
    });
  } else {
    res.status(400).send("Consulta não encontrada!")
  }
});

app.delete('/consultas/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const consulta = await db.orm.public.Consulta.where({ id }).delete()
  if (consulta) {
    res.json({
      mensagem: "Consulta deletada",
      data: consulta
    });
  } else {
    res.status(400).send("Consulta não existe!")
  }
});

app.get('/prontuarios', async (_: Request, res: Response) => {
  const prontuarios = await db.orm.public.Prontuario
    .select("id", "descricao", "data", "medico_responsavel_id", "paciente_id")
    .all()

  res.json(prontuarios);
});

app.get('/prontuarios/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const prontuario = await db.orm.public.Prontuario
    .where({ id })
    .include('paciente')
    .include('medico_responsavel', (medico) =>
      medico.select('name', 'email')
    )
    .first()
  if (prontuario) {
    res.json(prontuario);
  } else {
    res.status(400).send("Prontuário não existe!")
  }
});

app.post('/prontuario', async (req: Request, res: Response) => {
  const body = req.body;

  const prontuario = await db.orm.public.Prontuario.create({
    descricao: body.descricao,
    data: body.data,
    medico_responsavel_id: body.medico_responsavel_id,
    paciente_id: body.paciente_id
  });

  res.json({
    "mensagem": "Prontuário criado!",
    "data": prontuario
  });
});

app.put('/prontuarios/:id', async (req: Request, res: Response) => {
  const body = req.body;
  const id = Number(req.params.id)

  const prontuario = await db.orm.public.Prontuario.where({ id }).update({
    descricao: body.descricao,
    data: body.data,
    medico_responsavel_id: body.medico_responsavel_id,
    paciente_id: body.paciente_id
  });
  if (prontuario) {
    res.json({
      "mensagem": "Prontuário atualizado com sucesso!",
      "data": prontuario
    });
  } else {
    res.status(400).send("Prontuário não encontrado!")
  }
});

app.delete('/prontuarios/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const prontuario = await db.orm.public.Prontuario.where({ id }).delete()
  if (prontuario) {
    res.json({
      mensagem: "Prontuário deletado",
      data: prontuario
    });
  } else {
    res.status(400).send("Prontuário não existe!")
  }
});

app.listen(3000, () => {
  console.log("Rodando em http://localhost:3000")
});

