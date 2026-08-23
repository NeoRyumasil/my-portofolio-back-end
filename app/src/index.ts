import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { accountsRoutes } from './routes/account';
import { contactsRoutes } from './routes/contact';
import { credentialsRoutes } from './routes/credential';
import { gameProjectsRoutes } from './routes/game-project';
import { webProjectsRoutes } from './routes/web-project';
import { journeysRoutes } from './routes/journey';

const app = new Elysia()
  .use(cors())
  
  .get('/', () => 'Portfolio API is running!')
  
  .use(accountsRoutes)
  .use(contactsRoutes)
  .use(credentialsRoutes)
  .use(gameProjectsRoutes)
  .use(webProjectsRoutes)
  .use(journeysRoutes)  
  
  .listen(3001);

console.log(
  `🦊 Elysia API is running at http://${app.server?.hostname}:${app.server?.port}`
);