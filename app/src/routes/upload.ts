import { Elysia, t } from 'elysia';
import sharp from 'sharp';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { requireAuth } from '../middleware/auth';

let auth;

if (process.env.GDRIVE_CREDENTIALS) {
  const credentials = JSON.parse(process.env.GDRIVE_CREDENTIALS);
  auth = new google.auth.GoogleAuth({
    credentials, 
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

} else {
  const keyFilePath = process.env.GDRIVE_KEY_PATH || './gdrive-key.json';
  auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
}

const drive = google.drive({ version: 'v3', auth });

export const uploadRoutes = new Elysia({ prefix: '/api/upload' })
  .use(requireAuth) 
  
  .post('/', async ({ body: { image }, set }) => {
    try {
      const GDRIVE_FOLDER_ID = process.env.GDRIVE_FOLDER_ID;
      if (!GDRIVE_FOLDER_ID) {
        set.status = 500;
        return { success: false, message: 'GDRIVE_FOLDER_ID belum diatur di .env!' };
      }

      const arrayBuffer = await image.arrayBuffer();
      const webpBuffer = await sharp(Buffer.from(arrayBuffer))
        .webp({ quality: 80 })
        .toBuffer();

      const stream = Readable.from(webpBuffer);

      const fileMetadata = {
        name: `${crypto.randomUUID()}.webp`,
        parents: [GDRIVE_FOLDER_ID],
      };

      const media = {
        mimeType: 'image/webp',
        body: stream,
      };

      const file = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id', 
      });

      const directUrl = `https://drive.google.com/uc?export=view&id=${file.data.id}`;

      return { 
        success: true, 
        message: 'Gambar berhasil diupload ke Google Drive & dikonversi ke WebP',
        url: directUrl
      };

    } catch (error) {
      console.error('Upload Error:', error);
      set.status = 500;
      return { 
        success: false, 
        message: 'Gagal mengupload gambar ke Google Drive', 
        error: String(error) 
      };
    }
  }, {
    body: t.Object({
      image: t.File() 
    })
  });