const fs = require('fs').promises;

export default async function deleteFile(filePath: string) {
  try {
    await fs.unlink(filePath);
    console.log('File deleted successfully');
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err;
  }
}
