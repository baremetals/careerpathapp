import { promises as fsPromises } from 'fs';

export default async function deleteFile(filePath: string) {
  try {
    await fsPromises.unlink(filePath);
    console.log('File deleted successfully');
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err;
  }
}
