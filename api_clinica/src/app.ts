import express, { json, type Express, type Request, type Response } from 'express';
import { db } from './prisma/db';
import bcrypt from 'bcrypt';


const app: Express = express();
app.use(json())

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
  const hashSenha = await bcrypt.hash(body.password, 10)
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

