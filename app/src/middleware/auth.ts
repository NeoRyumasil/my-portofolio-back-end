import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';

export const requireAuth = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'rahasia-negara-super-aman',
    })
  )
  .onBeforeHandle(async ({ jwt, cookie: { auth_token }, set }) => {
    
    if (!auth_token.value) {
      set.status = 401;
      return { success: false, message: 'Unauthorized: Token tidak ditemukan di cookie' };
    }
    
    const payload = await jwt.verify(auth_token.value as string);

    if (!payload) {
      set.status = 401;
      return { success: false, message: 'Unauthorized: Token tidak valid atau kadaluarsa' };
    }
  });