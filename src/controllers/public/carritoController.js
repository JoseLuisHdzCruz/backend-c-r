const Carrito = require("../../../models/carritoModel");

const carritoController = {
  getCarrito: async (req, res) => {
    const { customerId } = req.params;
    try {
      const carritoItems = await Carrito.findAll({
        where: {customerId}
      });
      res.json(carritoItems);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).json({ error: "Error al obtener el carrito" });
    }
  },
  addToCarrito: async (req, res) => {
    try {
      const nuevoItem = await Carrito.create(req.body);
      res.status(201).json(nuevoItem);
    } catch (error) {
      console.error("Error al agregar un item al carrito:", error);
      res.status(500).json({ error: "Error al agregar un item al carrito" });
    }
  },
  updateCarrito : async (req, res) => {
    const { productoId, customerId, cantidad } = req.body;
    try {
        const [numRowsUpdated, updatedRows] = await Carrito.update(
            { cantidad: cantidad }, // Actualiza el campo cantidad
            { where: { customerId: customerId, productoId: productoId } } // Condiciones de búsqueda
        );
      if (numRowsUpdated === 0) {
        return res
          .status(404)
          .json({ error: "No se encontró el elemento del carrito" });
      }
      res.json(updatedRows[0]);
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      res.status(500).json({ error: "Error al actualizar el carrito" });
    }
  },
  deleteCarrito : async (req, res) => {
    const { productoId, customerId } = req.body;
    try {
      const deletedRows = await Carrito.destroy({ 
        where: { productoId, customerId } 
      });
      if (deletedRows === 0) {
        return res
          .status(404)
          .json({ error: "No se encontró el elemento del carrito" });
      }
      res.json({ message: "Elemento del carrito eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el elemento del carrito:", error);
      res
        .status(500)
        .json({ error: "Error al eliminar el elemento del carrito" });
    }
  },
  clearCarrito : async (req, res) => {
    const { customerId } = req.params;
  
    try {
      const deletedRows = await Carrito.destroy({ 
        where: { customerId } 
      });
      res.json({ message: `${deletedRows} elementos del carrito eliminados correctamente` });
    } catch (error) {
      console.error('Error al limpiar el carrito:', error);
      res.status(500).json({ error: 'Error al limpiar el carrito' });
    }
  }
};

module.exports = carritoController;