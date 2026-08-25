import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';

import { authRoutes } from './routes/auth';
import { accountsRoutes } from './routes/account';
import { contactsRoutes } from './routes/contact';
import { credentialsRoutes } from './routes/credential';
import { gameProjectsRoutes } from './routes/game-project';
import { webProjectsRoutes } from './routes/web-project';
import { journeysRoutes } from './routes/journey';
import { toolsRoutes } from './routes/tool';
import { profileRoutes } from './routes/profile';
import { overviewRoutes } from './routes/overview';

const app = new Elysia()
  .use(cors())

  .use(swagger({
    path: '/swagger', 
    documentation: {
      info: {
        title: 'Admin Portfolio API',
        version: '1.0.0',
        description: 'API Documentation untuk dashboard admin portofolio'
      }
    }
  }))
  
  .get('/', () => 'Portfolio API is running!')
  
  .use(authRoutes)
  .use(overviewRoutes)
  .use(accountsRoutes)
  .use(contactsRoutes)
  .use(credentialsRoutes)
  .use(gameProjectsRoutes)
  .use(webProjectsRoutes)
  .use(journeysRoutes)  
  .use(toolsRoutes)
  .use(profileRoutes)

  .listen(3001);

console.log(
  `🦊 Elysia API is running at http://${app.server?.hostname}:${app.server?.port}`
);

console.log(
  `📖 Swagger UI is available at http://${app.server?.hostname}:${app.server?.port}/swagger`
);