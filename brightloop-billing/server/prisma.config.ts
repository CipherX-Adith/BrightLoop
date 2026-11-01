import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Prisma CLI (migrate, db push, studio) uses the DIRECT unpooled connection
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || '',
  },
});
