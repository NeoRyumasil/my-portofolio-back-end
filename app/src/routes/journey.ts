import { Elysia, t } from 'elysia';
import { database } from '../database';
import { journeys } from '../database/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

export const journeysRoutes = new Elysia({ prefix: '/api/journeys' })

  // GET All Data
  .get('/', async () => {
    const allJourneys = await database.select().from(journeys).orderBy(desc(journeys.year));
    return { success: true, data: allJourneys };
  })

  // GET by ID
  .get('/:id', async ({ params: { id }, set }) => {
    const journey = await database.select().from(journeys).where(eq(journeys.id, id));
    
    if (journey.length === 0) {
      set.status = 404;
      return { success: false, message: 'Journey milestone not found' };
    }
    
    return { success: true, data: journey[0] };
  })

  // Auth Check
  .use(requireAuth)

  // POST New Milestone
  .post('/', async ({ body }) => {
    const newId = crypto.randomUUID(); 
    
    const newJourney = await database.insert(journeys).values({
      id: newId,
      year: body.year,
      label: body.label,
      title: body.title,
      description: body.description
    }).returning();

    return { success: true, message: 'Milestone created successfully', data: newJourney[0] };
  }, {
    body: t.Object({
      year: t.String(),
      label: t.String(),
      title: t.String(),
      description: t.String()
    })
  })

  // PUT Update Milestone
  .put('/:id', async ({ params: { id }, body, set }) => {
    const updatedJourney = await database.update(journeys)
      .set({
        year: body.year,
        label: body.label,
        title: body.title,
        description: body.description
      })
      .where(eq(journeys.id, id))
      .returning();

    if (updatedJourney.length === 0) {
      set.status = 404;
      return { success: false, message: 'Journey milestone not found' };
    }

    return { success: true, message: 'Milestone updated successfully', data: updatedJourney[0] };
  }, {
    body: t.Object({
      year: t.String(),
      label: t.String(),
      title: t.String(),
      description: t.String()
    })
  })

  // Delete Milestone
  .delete('/:id', async ({ params: { id }, set }) => {
    const deletedJourney = await database.delete(journeys).where(eq(journeys.id, id)).returning({ id: journeys.id });
    
    if (deletedJourney.length === 0) {
      set.status = 404;
      return { success: false, message: 'Journey milestone not found' };
    }

    return { success: true, message: 'Milestone deleted successfully' };
  });