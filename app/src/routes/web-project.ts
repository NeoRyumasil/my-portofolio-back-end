import { Elysia, t } from 'elysia';
import { database } from '../database';
import { webProjects } from '../database/schema';
import { eq, sql } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

export const webProjectsRoutes = new Elysia({ prefix: '/api/web-projects' })

  // GET All Data
  .get('/', async ({ query }) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 9; 
    const offset = (page - 1) * limit;

    const totalCountRes = await database
      .select({ count: sql<number>`count(*)` })
      .from(webProjects);
      
    const totalItems = Number(totalCountRes[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    const data = await database
      .select()
      .from(webProjects)
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
    const project = await database.select().from(webProjects).where(eq(webProjects.id, id));
    
    if (project.length === 0) {
      set.status = 404;
      return { success: false, message: 'Web project not found' };
    }
    
    return { success: true, data: project[0] };
  })

  // Auth Check
  .use(requireAuth)

  // POST New Web Project    
  .post('/', async ({ body }) => {
    const newId = crypto.randomUUID(); 
    
    const newProject = await database.insert(webProjects).values({
      id: newId,
      title: body.title,
      year: body.year,
      tech: body.tech, 
      role: body.role,
      url: body.url || '', 
      image: body.image,
      description: body.description
    }).returning();

    return { success: true, message: 'Web project created successfully', data: newProject[0] };
  }, {
    body: t.Object({
      title: t.String(),
      year: t.String(),
      tech: t.Array(t.String()), 
      role: t.String(),
      url: t.Optional(t.String()), 
      image: t.String(),
      description: t.String()
    })
  })

  // PUT Update Web Project  
  .put('/:id', async ({ params: { id }, body, set }) => {
    const updatedProject = await database.update(webProjects)
      .set({
        title: body.title,
        year: body.year,
        tech: body.tech,
        role: body.role,
        url: body.url || '',
        image: body.image,
        description: body.description
      })
      .where(eq(webProjects.id, id))
      .returning();

    if (updatedProject.length === 0) {
      set.status = 404;
      return { success: false, message: 'Web project not found' };
    }

    return { success: true, message: 'Web project updated successfully', data: updatedProject[0] };
  }, {
    body: t.Object({
      title: t.String(),
      year: t.String(),
      tech: t.Array(t.String()),
      role: t.String(),
      url: t.Optional(t.String()),
      image: t.String(),
      description: t.String()
    })
  })

  // Delete Web Project
  .delete('/:id', async ({ params: { id }, set }) => {
    const deletedProject = await database.delete(webProjects).where(eq(webProjects.id, id)).returning({ id: webProjects.id });
    
    if (deletedProject.length === 0) {
      set.status = 404;
      return { success: false, message: 'Web project not found' };
    }

    return { success: true, message: 'Web project deleted successfully' };
  });