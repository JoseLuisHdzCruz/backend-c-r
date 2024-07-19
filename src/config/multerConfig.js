const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Para generar nombres únicos para los archivos

const storage = multer.memoryStorage(); // Usar almacenamiento en memoria

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Filtra archivos permitidos (por ejemplo, solo imágenes)
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten imágenes'));
    }
    cb(null, true);
  }
});

module.exports = upload;
