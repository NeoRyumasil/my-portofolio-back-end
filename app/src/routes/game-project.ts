import { Elysia, t } from 'elysia';
import { database } from '../database';
import { gameProjects } from '../database/schema';
import { eq } from 'drizzle-orm';

export const gameProjectsRoutes = new Elysia({ prefix: '/api/game-projects' })

  // GET All Data
  .get('/', async () => {
    const allGames = await database.select().from(gameProjects);
    return { success: true, data: allGames };
  })

  // GET by ID:
  .get('/:id', async ({ params: { id }, set }) => {
    const game = await database.select().from(gameProjects).where(eq(gameProjects.id, id));
    
    if (game.length === 0) {
      set.status = 404;
      return { success: false, message: 'Game project not found' };
    }
    
    return { success: true, data: game[0] };
  })

  // POST New Game Project
  .post('/', async ({ body }) => {
    const newId = crypto.randomUUID(); 
    
    const newGame = await database.insert(gameProjects).values({
      id: newId,
      title: body.title,
      year: body.year,
      tech: body.tech, 
      role: body.role,
      url: body.url || '',
      image: body.image,
      description: body.description
    }).returning();

    return { success: true, message: 'Game project created successfully', data: newGame[0] };
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

  // PUT Update Game Project
  .put('/:id', async ({ params: { id }, body, set }) => {
    const updatedGame = await database.update(gameProjects)
      .set({
        title: body.title,
        year: body.year,
        tech: body.tech,
        role: body.role,
        url: body.url || '',
        image: body.image,
        description: body.description
      })
      .where(eq(gameProjects.id, id))
      .returning();

    if (updatedGame.length === 0) {
      set.status = 404;
      return { success: false, message: 'Game project not found' };
    }

    return { success: true, message: 'Game project updated successfully', data: updatedGame[0] };
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

  // DELETE Game Project
  .delete('/:id', async ({ params: { id }, set }) => {
    const deletedGame = await database.delete(gameProjects).where(eq(gameProjects.id, id)).returning({ id: gameProjects.id });
    
    if (deletedGame.length === 0) {
      set.status = 404;
      return { success: false, message: 'Game project not found' };
    }

    return { success: true, message: 'Game project deleted successfully' };
  });