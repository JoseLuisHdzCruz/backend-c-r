const Promociones = require("../../../models/promocionesModel");
const { Op } = require("sequelize");

const promocionesController = {
    obtenerPromocionesPorFecha: async (req, res) => {
        try {
            const { fecha } = req.params;
    
            if (!fecha) {
                return res.status(400).json({ error: 'Se requiere la fecha para filtrar las promociones.' });
            }
    
            const promociones = await Promociones.findAll({
                where: {
                    fecha_inicio: { [Op.lte]: fecha }, // La fecha de inicio debe ser menor o igual que la fecha proporcionada
                    fecha_final: { [Op.gte]: fecha }   // La fecha final debe ser mayor o igual que la fecha proporcionada
                }
            });
    
            return res.json(promociones);
        } catch (error) {
            console.error('Error al obtener las promociones por fecha:', error);
            return res.status(500).json({ error: 'Ocurrió un error al obtener las promociones por fecha.' });
        }
    }
};

module.exports = promocionesController;
