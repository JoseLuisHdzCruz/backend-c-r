// /src/controllers/userController.js

const db = require('../../config/database');

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await db.query('SELECT * FROM usuarios');
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  getUserById: async (req, res, next) => {
    const userId = req.params.id;
    try {
      const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
      if (user.length > 0) {
        res.json(user[0]);
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (err) {
      next(err);
    }
  },

  // Agrega aquí otras funciones para crear, actualizar y eliminar usuarios
};
