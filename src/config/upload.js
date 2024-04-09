// middleware/upload.js
const multer = require('multer');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define la carpeta de destino para guardar los archivos
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Define el nombre del archivo cuando se guarda
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Filtrar qué tipos de archivos se permiten subir
const fileFilter = (req, file, cb) => {
  // Solo se permiten archivos de imagen
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo debe ser una imagen'), false);
  }
};

// Configuración del middleware multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limita el tamaño del archivo a 5MB
  }
});

module.exports = upload;


