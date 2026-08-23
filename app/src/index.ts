import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { accountsRoutes } from './routes/account';

const app = new Elysia()
  .use(cors())
  
  .get('/', () => 'Portfolio API is running! 🚀')
  
  .use(accountsRoutes)
  
  .listen(3001);

console.log(
  `🦊 Elysia API is running at http://${app.server?.hostname}:${app.server?.port}`
);