const NotificacionesAdmin = require("../../../models/notificacionesAdminModel");

const adminController = {
    getAllNotifications: async (req, res, next) => {
        const { admonId } = req.params;
        try {
          const notificaciones = await NotificacionesAdmin.findAll({
            where: {
              admonId // Filtrar por customerId
            }
          });
          res.json(notificaciones);
        } catch (error) {
          console.error("Error al obtener todas las notificaciones:", error);
          res
            .status(500)
            .json({ error: "¡Algo salió mal al obtener todas las notificaciones!" });
        }
      },
};

module.exports = adminController;