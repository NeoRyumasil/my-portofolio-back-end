import { Elysia, t } from 'elysia';
import { database } from '../database';
import { webProjects } from '../database/schema';
import { eq } from 'drizzle-orm';

export const webProjectsRoutes = new Elysia({ prefix: '/api/web-projects' })

  // GET All Data
  .get('/', async () => {
    const allWebProjects = await database.select().from(webProjects);
    return { success: true, data: allWebProjects };
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