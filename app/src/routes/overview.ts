import { Elysia } from 'elysia';
import { database } from '../database';
import { webProjects, gameProjects, credentials, profile } from '../database/schema';
import { sql, eq } from 'drizzle-orm';

export const overviewRoutes = new Elysia({ prefix: '/api/overview' })

  // Get Overview Data
  .get('/', async () => {
    const webCountRes = await database.select({ count: sql<number>`count(*)` }).from(webProjects);
    const gameCountRes = await database.select({ count: sql<number>`count(*)` }).from(gameProjects);
    const credentialsCountRes = await database.select({ count: sql<number>`count(*)` }).from(credentials);

    const webCount = Number(webCountRes[0].count);
    const gameCount = Number(gameCountRes[0].count);
    const credentialsCount = Number(credentialsCountRes[0].count);
    const totalProjects = webCount + gameCount;

    const topProjects = await database.select().from(webProjects).limit(3);
    const topCredentials = await database.select().from(credentials).limit(3);

    const profileData = await database.select({ views: profile.views }).from(profile).where(eq(profile.id, 'admin'));
    const pageViews = profileData.length > 0 ? (profileData[0].views || 0) : 0;

    return {
      success: true,
      data: {
        stats: {
          totalProjects,
          webAppProjects: webCount,
          gameProjects: gameCount,
          credentials: credentialsCount,
          pageViews 
        },
        topProjects,
        topCredentials
      }
    };
  })

  // POST Track Page View
  .post('/track', async () => {
    await database.update(profile)
      .set({ views: sql`${profile.views} + 1` })
      .where(eq(profile.id, 'admin'));

    return { success: true, message: 'View tracked successfully' };
  });