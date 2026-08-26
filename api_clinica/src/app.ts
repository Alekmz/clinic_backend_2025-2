import express, { type Express, type Request, type Response } from 'express';
import { db } from './prisma/db';

const app: Express = express();

app.get('/usuarios', async (req: Request, res: Response) => {
  const users = await db.orm.public.User.select("id", "username", "email").all()
  
  res.json(users);
});

app.listen(3000);

