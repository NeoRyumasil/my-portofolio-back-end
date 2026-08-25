import { Elysia, t } from 'elysia';
import { database } from '../database';
import { tools } from '../database/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

export const toolsRoutes = new Elysia({ prefix: '/api/tools' })

  // GET All Data
  .get('/', async () => {
    const allTools = await database.select().from(tools);
    return { success: true, data: allTools };
  })

  // GET by ID
  .get('/:id', async ({ params: { id }, set }) => {
    const tool = await database.select().from(tools).where(eq(tools.id, id));
    
    if (tool.length === 0) {
      set.status = 404;
      return { success: false, message: 'Tool not found' };
    }
    
    return { success: true, data: tool[0] };
  })

  // Auth Check
  .use(requireAuth)

  // POST New Tool
  .post('/', async ({ body }) => {
    const newId = crypto.randomUUID(); 
    
    const newTool = await database.insert(tools).values({
      id: newId,
      name: body.name,
      category: body.category,
      icon: body.icon
    }).returning();

    return { success: true, message: 'Tool created successfully', data: newTool[0] };
  }, {
    body: t.Object({
      name: t.String(),
      category: t.String(),
      icon: t.String()
    })
  })

  // PUT Update Tool
  .put('/:id', async ({ params: { id }, body, set }) => {
    const updatedTool = await database.update(tools)
      .set({
        name: body.name,
        category: body.category,
        icon: body.icon
      })
      .where(eq(tools.id, id))
      .returning();

    if (updatedTool.length === 0) {
      set.status = 404;
      return { success: false, message: 'Tool not found' };
    }

    return { success: true, message: 'Tool updated successfully', data: updatedTool[0] };
  }, {
    body: t.Object({
      name: t.String(),
      category: t.String(),
      icon: t.String()
    })
  })

  // DELETE Tool
  .delete('/:id', async ({ params: { id }, set }) => {
    const deletedTool = await database.delete(tools).where(eq(tools.id, id)).returning({ id: tools.id });
    
    if (deletedTool.length === 0) {
      set.status = 404;
      return { success: false, message: 'Tool not found' };
    }

    return { success: true, message: 'Tool deleted successfully' };
  });