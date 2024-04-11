// cloudinaryConfig.js

const cloudinary = require('cloudinary').v2;

function configureCloudinary() {
  const cloud_name = process.env.CLOUD_NAME;
  const api_key = process.env.CLOUD_API_KEY;
  const api_secret = process.env.CLOUD_API_SECRET;

  // Validar que todas las variables de entorno estén configuradas
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error('Faltan variables de entorno para la configuración de Cloudinary.');
  }

  // Configurar Cloudinary
  cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret
  });
  
  return cloudinary;
}

module.exports = configureCloudinary();
