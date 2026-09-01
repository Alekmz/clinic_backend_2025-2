import express, { json, type Express, type Request, type Response } from 'express';
import { db } from './prisma/db';
import bcrypt  from 'bcrypt';


const app: Express = express();
app.use(json())

app.get('/usuarios', async (_: Request, res: Response) => {
  const users = await db.orm.public.User.select("id", "username", "email").all()

  res.json(users);
});

app.post('/usuario', async (req: Request, res: Response) => {
  const body = req.body;
  const hashSenha =  await bcrypt.hash(body.password, 10)
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

app.listen(3000, () => {
  console.log("Rodando em http://localhost:3000")
});

