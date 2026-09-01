import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract, TypeMaps } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env['DATABASE_URL']!,
});
