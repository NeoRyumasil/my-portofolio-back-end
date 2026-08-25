import { Elysia, t } from 'elysia';
import { database } from '../database';
import { credentials } from '../database/schema';
import { eq } from 'drizzle-orm';

export const credentialsRoutes = new Elysia({ prefix: '/api/credentials' })

  // GET All Data
  .get('/', async () => {
    const allCredentials = await database.select().from(credentials);
    return { success: true, data: allCredentials };
  })

  // GET by ID
  .get('/:id', async ({ params: { id }, set }) => {
    const credential = await database.select().from(credentials).where(eq(credentials.id, id));
    
    if (credential.length === 0) {
      set.status = 404;
      return { success: false, message: 'Credential not found' };
    }
    
    return { success: true, data: credential[0] };
  })

  // POST New Credential
  .post('/', async ({ body }) => {
    const newId = crypto.randomUUID(); 
    
    const newCredential = await database.insert(credentials).values({
      id: newId,
      title: body.title,
      issuer: body.issuer,
      image: body.image,
      url: body.url || '' 
    }).returning();

    return { success: true, message: 'Credential created successfully', data: newCredential[0] };
  }, {
    body: t.Object({
      title: t.String(),
      issuer: t.String(),
      image: t.String(),
      url: t.Optional(t.String()) 
    })
  })

  // PUT Update Credential
  .put('/:id', async ({ params: { id }, body, set }) => {
    const updatedCredential = await database.update(credentials)
      .set({
        title: body.title,
        issuer: body.issuer,
        image: body.image,
        url: body.url || ''
      })
      .where(eq(credentials.id, id))
      .returning();

    if (updatedCredential.length === 0) {
      set.status = 404;
      return { success: false, message: 'Credential not found' };
    }

    return { success: true, message: 'Credential updated successfully', data: updatedCredential[0] };
  }, {
    body: t.Object({
      title: t.String(),
      issuer: t.String(),
      image: t.String(),
      url: t.Optional(t.String())
    })
  })

  // DELETE Credential
  .delete('/:id', async ({ params: { id }, set }) => {
    const deletedCredential = await database.delete(credentials).where(eq(credentials.id, id)).returning({ id: credentials.id });
    
    if (deletedCredential.length === 0) {
      set.status = 404;
      return { success: false, message: 'Credential not found' };
    }

    return { success: true, message: 'Credential deleted successfully' };
  });