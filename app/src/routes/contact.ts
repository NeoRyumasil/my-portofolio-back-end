import { Elysia, t } from 'elysia';
import { database } from '../database';
import { contacts } from '../database/schema';
import { eq } from 'drizzle-orm';

export const contactsRoutes = new Elysia({ prefix: '/api/contacts' })

  // 1. GET: Ambil semua kontak sosmed
  .get('/', async () => {
    const allContacts = await database.select().from(contacts);
    return { success: true, data: allContacts };
  })

  // 2. GET by ID
  .get('/:id', async ({ params: { id }, set }) => {
    const contact = await database.select().from(contacts).where(eq(contacts.id, id));
    
    if (contact.length === 0) {
      set.status = 404;
      return { success: false, message: 'Contact not found' };
    }
    
    return { success: true, data: contact[0] };
  })

  // 3. POST New Contact
  .post('/', async ({ body }) => {
    const newId = crypto.randomUUID(); 
    
    const newContact = await database.insert(contacts).values({
      id: newId,
      platform: body.platform,
      url: body.url,
      iconType: body.iconType,
      iconValue: body.iconValue
    }).returning();

    return { success: true, message: 'Contact created successfully', data: newContact[0] };
  }, {
    body: t.Object({
      platform: t.String(),
      url: t.String(),
      iconType: t.String(), 
      iconValue: t.String()
    })
  })

  // 4. PUT Update Contact  
  .put('/:id', async ({ params: { id }, body, set }) => {
    const updatedContact = await database.update(contacts)
      .set({
        platform: body.platform,
        url: body.url,
        iconType: body.iconType,
        iconValue: body.iconValue
      })
      .where(eq(contacts.id, id))
      .returning();

    if (updatedContact.length === 0) {
      set.status = 404;
      return { success: false, message: 'Contact not found' };
    }

    return { success: true, message: 'Contact updated successfully', data: updatedContact[0] };
  }, {
    body: t.Object({
      platform: t.String(),
      url: t.String(),
      iconType: t.String(),
      iconValue: t.String()
    })
  })

  // 5. DELETE Contact
  .delete('/:id', async ({ params: { id }, set }) => {
    const deletedContact = await database.delete(contacts).where(eq(contacts.id, id)).returning({ id: contacts.id });
    
    if (deletedContact.length === 0) {
      set.status = 404;
      return { success: false, message: 'Contact not found' };
    }

    return { success: true, message: 'Contact deleted successfully' };
  });