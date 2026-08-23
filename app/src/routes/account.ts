import { Elysia, t } from 'elysia';
import { database } from '../database';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

export const accountsRoutes = new Elysia({ prefix: '/api/accounts' })

  // GET All Data
  .get('/', async () => {
    const allAccounts = await database.select({
      id: users.id,
      username: users.username,
      createdAt: users.createdAt
    }).from(users);
    
    return { success: true, data: allAccounts };
  })

  // GET by ID
  .get('/:id', async ({ params: { id }, set }) => {
    const account = await database.select({
      id: users.id,
      username: users.username,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.id, id));

    if (account.length === 0) {
      set.status = 404;
      return { success: false, message: 'Akun tidak ditemukan' };
    }

    return { success: true, data: account[0] };
  })

  // POST New Account
  .post('/', async ({ body, set }) => {
    const { username, password } = body;
    
    // Username Check
    const existingUser = await database.select().from(users).where(eq(users.username, username));
    if (existingUser.length > 0) {
      set.status = 400;
      return { success: false, message: 'Username sudah digunakan!' };
    }

    // Hash Password
    const hashedPassword = await Bun.password.hash(password);
    const newId = crypto.randomUUID(); 

    const newUser = await database.insert(users).values({
      id: newId,
      username,
      password: hashedPassword
    }).returning({
      id: users.id,
      username: users.username
    });

    return { success: true, message: 'Akun berhasil dibuat', data: newUser[0] };
  }, {
    // Input Validation
    body: t.Object({
      username: t.String(),
      password: t.String()
    })
  })

  // 3. PUT Update Account  
  .put('/:id', async ({ params: { id }, body, set }) => {
    const { username, password } = body;
    
    const updateData: any = { username };
    
    if (password && password.trim() !== '') {
      updateData.password = await Bun.password.hash(password);
    }

    const updatedUser = await database.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({ id: users.id, username: users.username });

    if (updatedUser.length === 0) {
      set.status = 404;
      return { success: false, message: 'Akun tidak ditemukan' };
    }

    return { success: true, message: 'Akun berhasil diupdate', data: updatedUser[0] };
  }, {
    body: t.Object({
      username: t.String(),
      password: t.Optional(t.String()) 
    })
  })

  // 4. DELETE Hapus akun
  .delete('/:id', async ({ params: { id }, set }) => {
    const deletedUser = await database.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    
    if (deletedUser.length === 0) {
      set.status = 404;
      return { success: false, message: 'Akun tidak ditemukan' };
    }

    return { success: true, message: 'Akun berhasil dihapus' };
  });