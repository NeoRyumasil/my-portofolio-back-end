import { Elysia, t } from 'elysia';
import { database } from '../database';
import { profile } from '../database/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

export const profileRoutes = new Elysia({ prefix: '/api/profile' })

  // Get All Data
  .get('/', async () => {
    const profiles = await database.select().from(profile);
    return { success: true, data: profiles };
  })

  // GET by ID
  .get('/:id', async ({ params: { id }, set }) => {
    const singleProfile = await database.select().from(profile).where(eq(profile.id, id));
    
    if (singleProfile.length === 0) {
      set.status = 404;
      return { success: false, message: 'Profile not found' };
    }
    
    return { success: true, data: singleProfile[0] };
  })

  // Auth Check
  .use(requireAuth)

  // POST New Profile
  .post('/', async ({ body }) => {
    const newId = body.id || 'admin'; 
    
    const newProfile = await database.insert(profile).values({
      id: newId,
      role: body.role,
      fullName: body.fullName,
      tagline: body.tagline,
      bio: body.bio,
      cvLink: body.cvLink || '',
      profileImage: body.profileImage || ''
    }).returning();

    return { success: true, message: 'Profile created successfully', data: newProfile[0] };
  }, {
    body: t.Object({
      id: t.Optional(t.String()), 
      role: t.String(),
      fullName: t.String(),
      tagline: t.String(),
      bio: t.String(),
      cvLink: t.Optional(t.String()),
      profileImage: t.Optional(t.String())
    })
  })

  // PUT Update Profile
  .put('/:id', async ({ params: { id }, body, set }) => {
    const updatedProfile = await database.update(profile)
      .set({
        role: body.role,
        fullName: body.fullName,
        tagline: body.tagline,
        bio: body.bio,
        cvLink: body.cvLink || '',
        profileImage: body.profileImage || ''
      })
      .where(eq(profile.id, id))
      .returning();

    if (updatedProfile.length === 0) {
      set.status = 404;
      return { success: false, message: 'Profile not found' };
    }

    return { success: true, message: 'Profile updated successfully', data: updatedProfile[0] };
  }, {
    body: t.Object({
      role: t.String(),
      fullName: t.String(),
      tagline: t.String(),
      bio: t.String(),
      cvLink: t.Optional(t.String()),
      profileImage: t.Optional(t.String())
    })
  })

  // DELETE Profile
  .delete('/:id', async ({ params: { id }, set }) => {
    const deletedProfile = await database.delete(profile)
      .where(eq(profile.id, id))
      .returning({ id: profile.id });
    
    if (deletedProfile.length === 0) {
      set.status = 404;
      return { success: false, message: 'Profile not found' };
    }

    return { success: true, message: 'Profile deleted successfully' };
  });
