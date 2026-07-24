const { put } = require('@vercel/blob');
const Busboy = require('busboy');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const busboy = new Busboy({ headers: req.headers });
    let fileBuffer = null;
    let fileName = null;

    busboy.on('file', (fieldname, file, info) => {
      const { filename } = info;
      fileName = filename;
      const chunks = [];
      file.on('data', (data) => chunks.push(data));
      file.on('end', () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    await new Promise((resolve, reject) => {
      busboy.on('finish', resolve);
      busboy.on('error', reject);
      req.pipe(busboy);
    });

    if (!fileBuffer || !fileName) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const blob = await put(`recordings/${Date.now()}-${fileName}`, fileBuffer, {
      access: 'public',
    });

    res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
};