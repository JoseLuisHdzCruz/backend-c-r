// cloudinaryConfig.js

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.CLOUD_API_KEY;
const api_secret= process.env.CLOUD_API_SECRET;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret
});

// Configuración del middleware upload
const upload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Debes proporcionar una imagen' });
  }

  // Cargar la imagen a Cloudinary
  const upload_stream = cloudinary.uploader.upload_stream(
    { folder: 'profile_img' }, // Opcional: nombre de la carpeta en Cloudinary donde se almacenarán las imágenes
    (error, result) => {
      if (error) {
        console.error('Error al subir la imagen a Cloudinary:', error);
        return res.status(500).json({ message: 'Error al subir la imagen a Cloudinary' });
      }

      // Almacenar la URL de la imagen en req.body
      req.body.imageUrl = result.secure_url;
      next();
    }
  );

  // Convertir el stream de la imagen a un buffer y pasarlo al stream de carga de Cloudinary
  streamifier.createReadStream(req.file.buffer).pipe(upload_stream);
};

module.exports = upload;
