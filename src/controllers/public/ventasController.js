const Venta = require("../../../models/ventaModel");
const DetalleVenta = require("../../../models/detalleVentaModel")
const { v4: uuidv4 } = require('uuid');
const axios = require("axios");


const ventasController = {
  // Controlador para crear una nueva venta
  crearVenta: async (req, res) => {
    try {
        const { 
            metodoPagoId,
            customerId, 
            venta
        } = req.body;
        
        // Fecha actual
        const fecha = new Date();

        // Generar folio manualmente (puedes implementar la lógica que necesites para generar el folio)
        const folio = uuidv4();

        const statusVentaId = 1;
        const nuevaVenta = await Venta.create({
            folio,
            customerId: customerId,
            cantidad: venta.cantidad,
            total: venta.total,
            totalProductos: venta.totalProductos,
            totalEnvio: venta.totalEnvio,
            totalIVA: venta.totalIVA,
            fecha,
            statusVentaId,
            metodoPagoId: metodoPagoId,
            sucursalesId: venta.sucursalesId,
            domicilioId: venta.domicilioId
        });
      // Crear los registros de detalle de venta
      const detallesVenta = await Promise.all(venta.productos.map(async producto => {
        const detalleVenta = await DetalleVenta.create({
            productoId: producto.productoId,
            producto: producto.producto,
            precio: producto.precio,
            imagen: producto.imagen,
            IVA: producto.IVA,
            cantidad: producto.cantidad,
            totalDV: producto.totalDV,
            ventaId: nuevaVenta.ventaId
        });
        return detalleVenta;
    }));

    await axios.delete(`https://backend-c-r-production.up.railway.app/cart/clear/${customerId}`);


    // Respuesta exitosa
    res.status(201).json({ venta: nuevaVenta, detallesVenta });
    } catch (error) {
      console.error("Error al crear la venta con detalle:", error);
      res.status(500).json({ error: "Error al crear la venta con detalle" });
    }
  },

  // Controlador para obtener todos los registros de ventas
  obtenerTodasLasVentas: async (req, res) => {
    try {
      const ventas = await Venta.findAll();
      res.json(ventas);
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
      res.status(500).json({ error: "Error al obtener las ventas" });
    }
  },

  // Controlador para obtener una venta por su ID
  obtenerVentaPorId: async (req, res) => {
    const ventaId = req.params.id;
    try {
      const venta = await Venta.findByPk(ventaId);
      if (!venta) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }
      res.json(venta);
    } catch (error) {
      console.error("Error al obtener la venta por ID:", error);
      res.status(500).json({ error: "Error al obtener la venta por ID" });
    }
  },


   // Controlador para obtener una venta por su ID
   obtenerDetalleVentaPorIdVenta: async (req, res) => {
    const ventaId = req.params.id;
    try {
      const venta = await DetalleVenta.findAll({where: { ventaId }});
      if (!venta) {
        return res.status(404).json({ error: "Detalle venta no encontrada" });
      }
      res.json(venta);
    } catch (error) {
      console.error("Error al obtener el detalle venta por ventaId:", error);
      res.status(500).json({ error: "Error  el detalle venta por ventaId" });
    }
  },

  // Controlador para obtener todas las ventas de un cliente por su ID de cliente
  obtenerVentasPorCustomerId: async (req, res) => {
    const customerId = req.params.customerId;
    try {
      const ventas = await Venta.findAll({ where: { customerId } });
      res.json(ventas);
    } catch (error) {
      console.error("Error al obtener las ventas por customerId:", error);
      res
        .status(500)
        .json({ error: "Error al obtener las ventas por customerId" });
    }
  },

  filtrarVentasPorFecha : async (req, res) => {
    const {fechaFinal, fechaInicial} = req.body;
    try {
      const ventasFiltradas = await Venta.findAll({
        where: {
          fecha: {
            [Op.between]: [fechaInicial, fechaFinal] // Utiliza el operador between para filtrar por rango de fechas
          }
        }
      });
      res.json(ventasFiltradas);
    } catch (error) {
      console.error('Error al filtrar ventas por fecha:', error);
      throw new Error('Error al filtrar ventas por fecha');
    }
  }
};

module.exports = ventasController;
