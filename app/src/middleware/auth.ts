import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';

export const requireAuth = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'rahasia-negara-super-aman',
    })
  )
  
  .onBeforeHandle(async ({ jwt, headers, set }) => {
    const authHeader = headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      return { success: false, message: 'Unauthorized: Harap sertakan token Bearer' };
    }

    const token = authHeader.split(' ')[1];
    
    const payload = await jwt.verify(token);

    if (!payload) {
      set.status = 401;
      return { success: false, message: 'Unauthorized' };
    }
  });