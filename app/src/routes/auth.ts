import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { database } from '../database';
import { users } from '../database/schema'; 
import { eq } from 'drizzle-orm';

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'rahasia-negara-super-aman',
    })
  )
  
  // Login Endpoint
  .post('/login', async ({ body, jwt, set }) => {
    const userResult = await database.select().from(users).where(eq(users.username, body.username));
    
    if (userResult.length === 0) {
      set.status = 401;
      return { success: false, message: 'Username atau password salah' };
    }

    const foundUser = userResult[0];
    const isMatch = await Bun.password.verify(body.password, foundUser.password);

    if (!isMatch) {
      set.status = 401;
      return { success: false, message: 'Username atau password salah' };
    }

    const token = await jwt.sign({ 
      id: foundUser.id, 
      username: foundUser.username 
    });

    return { 
      success: true, 
      message: 'Login berhasil', 
      token 
    };
  }, {
    body: t.Object({
      username: t.String(),
      password: t.String()
    })
  });