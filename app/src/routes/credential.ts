import { Elysia, t } from 'elysia';
import { database } from '../database';
import { credentials } from '../database/schema';
import { eq, sql } from 'drizzle-orm'; 
import { requireAuth } from '../middleware/auth';

export const credentialsRoutes = new Elysia({ prefix: '/api/credentials' })

  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 9; 
    const offset = (page - 1) * limit;

    const totalCountRes = await database
      .select({ count: sql<number>`count(*)` })
      .from(credentials);
      
    const totalItems = Number(totalCountRes[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    const data = await database
      .select()
      .from(credentials)
      .limit(limit)
      .offset(offset);

    return { 
      success: true, 
      data,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }, {
    query: t.Optional(t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String())
    }))
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

  // Auth Check
  .use(requireAuth)

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