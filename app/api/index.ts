import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

import { ErrorHandler } from '../src/middleware/error-handler';  
import { authRoutes } from '../src/routes/auth';
import { accountsRoutes } from '../src/routes/account';
import { contactsRoutes } from '../src/routes/contact';
import { credentialsRoutes } from '../src/routes/credential';
import { gameProjectsRoutes } from '../src/routes/game-project';
import { webProjectsRoutes } from '../src/routes/web-project';
import { journeysRoutes } from '../src/routes/journey';
import { toolsRoutes } from '../src/routes/tool';
import { profileRoutes } from '../src/routes/profile';
import { overviewRoutes } from '../src/routes/overview';
import { uploadRoutes } from '../src/routes/upload';

const allowedOrigins = process.env.FRONTEND_URLS 
  ? process.env.FRONTEND_URLS.split(',') 
  : ['http://localhost:3000'];

const app = new Elysia()
  .use(ErrorHandler)
  .use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
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
  .use(uploadRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(3001);
}

export default async function handler(req: Request, res: any) {
  return app.handle(req);
}