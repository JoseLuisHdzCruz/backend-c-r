const Domicilio = require("../../../models/domicilioModel");
const Sucursal = require("../../../models/sucursalesModel");
const Usuario = require("../../../models/usuarioModel");
const Colonia = require("../../../models/coloniaModel");

const domicilioController = {
  getAllColoniasByCP: async (req, res, next) => {
    const codigo = req.params.cp;
    try {
      const colonias = await Colonia.findAll({
        where: {
          codigo_postal: codigo // Filtrar por customerId
        }
      });
      const response = colonias.length > 0 ? colonias : ['No se encontarron colonias para este CP'] 
      res.json(response)
    } catch (error) {
      console.error("Error al obtener todas las direcciones:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener todas las direcciones!" });
    }
  },
  
  getAllDomicilios: async (req, res, next) => {
    const UserId = req.params.id;
    try {
      const domicilios = await Domicilio.findAll({
        where: {
          customerId: UserId // Filtrar por customerId
        }
      });
      res.json(domicilios);
    } catch (error) {
      console.error("Error al obtener todas las direcciones:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener todas las direcciones!" });
    }
  },

  createDomicilio: async (req, res, next) => {
    const domicilioData = req.body;

    try {
      const newDomicilio = await Domicilio.create(domicilioData);
      res.status(201).json(newDomicilio);
    } catch (error) {
      console.error("Error al crear domicilio:", error);
      res.status(500).json({ error: "¡Algo salió mal al crear domicilio!" });
    }
  },

  updateDomicilio: async (req, res, next) => {
    const domicilioId = req.params.id;
    const domicilioData = req.body;

    try {
      const existingDomicilio = await Domicilio.findByPk(domicilioId);
      if (!existingDomicilio) {
        return res.status(404).json({ error: "Domicilio no encontrado" });
      }

      await existingDomicilio.update(domicilioData);
      res.json(existingDomicilio);
    } catch (error) {
      console.error("Error al actualizar domicilio:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al actualizar domicilio!" });
    }
  },

  deleteDomicilio: async (req, res, next) => {
    const domicilioId = req.params.id;

    try {
      const deletedDomicilio = await Domicilio.destroy({
        where: { DomicilioId: domicilioId },
      });
      if (deletedDomicilio === 0) {
        return res.status(404).json({ error: "Domicilio no encontrado" });
      }

      res.json({ message: "Domicilio eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar domicilio:", error);
      res.status(500).json({ error: "¡Algo salió mal al eliminar domicilio!" });
    }
  },

  getDomicilioById: async (req, res, next) => {
    const domicilioId = req.params.id;

    try {
      const domicilio = await Domicilio.findByPk(domicilioId);
      if (domicilio) {
        res.json(domicilio);
      } else {
        res.status(404).json({ message: "Domicilio no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener domicilio por ID:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener domicilio por ID!" });
    }
  },

  getAllSucursales: async (req, res, next) => {
    try {
      const sucursales = await Sucursal.findAll();
      res.json(sucursales);
    } catch (error) {
      console.error("Error al obtener todas las sucursales:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener todas las sucursales!" });
    }
  },

  createSucursal: async (req, res, next) => {
    const sucursalData = req.body;

    try {
      const newSucursal = await Sucursal.create(sucursalData);
      res.status(201).json(newSucursal);
    } catch (error) {
      console.error("Error al crear sucursal:", error);
      res.status(500).json({ error: "¡Algo salió mal al crear sucursal!" });
    }
  },

  updateSucursal: async (req, res, next) => {
    const sucursalId = req.params.id;
    const sucursalData = req.body;

    try {
      const existingSucursal = await Sucursal.findByPk(sucursalId);
      if (!existingSucursal) {
        return res.status(404).json({ error: "Sucursal no encontrada" });
      }

      await existingSucursal.update(sucursalData);
      res.json(existingSucursal);
    } catch (error) {
      console.error("Error al actualizar sucursal:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al actualizar sucursal!" });
    }
  },

  deleteSucursal: async (req, res, next) => {
    const sucursalId = req.params.id;

    try {
      const deletedSucursal = await Sucursal.destroy({
        where: { SucursalId: sucursalId },
      });
      if (deletedSucursal === 0) {
        return res.status(404).json({ error: "Sucursal no encontrada" });
      }

      res.json({ message: "Sucursal eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar sucursal:", error);
      res.status(500).json({ error: "¡Algo salió mal al eliminar sucursal!" });
    }
  },

  getSucursalById: async (req, res, next) => {
    const sucursalId = req.params.id;

    try {
      const sucursal = await Sucursal.findByPk(sucursalId);
      if (sucursal) {
        res.json(sucursal);
      } else {
        res.status(404).json({ message: "Sucursal no encontrada" });
      }
    } catch (error) {
      console.error("Error al obtener sucursal por ID:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener sucursal por ID!" });
    }
  },
};

module.exports = domicilioController;