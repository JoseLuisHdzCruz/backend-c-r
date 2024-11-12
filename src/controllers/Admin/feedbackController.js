// Importar el modelo de FeedbackQuestion
const Question = require("../../../models/questionModel");
const Feedback = require("../../../models/feedbacksModel");
const Usuario = require("../../../models/usuarioModel");

const feedbackController = {
  getQuestions: async (req, res) => {
    try {
      const questions = await Question.findAll();
      res.status(200).json(questions);
    } catch (error) {
      console.error("Error al obtener las preguntas de feedback:", error);
      res.status(500).json({
        error: "¡Algo salió mal al obtener las preguntas de feedback!",
      });
    }
  },

  getFeedbacks: async (req, res) => {
    try {
      const feedbacks = await Feedback.findAll();
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error("Error al obtener las resultados del feedback:", error);
      res.status(500).json({
        error: "¡Algo salió mal al obtener los resultados de feedback!",
      });
    }
  },
  
  saveFeedback: async (req, res) => {
    try {
      const { customerId, feedback } = req.body; 
  
      // Crear las entradas de feedback
      const feedbackEntries = feedback.map(({ questionId, rating }) => ({
        customerId,
        questionId,
        rating,
      }));
  
      // Guardar las entradas de feedback en la base de datos
      await Feedback.bulkCreate(feedbackEntries);
  
      // Actualizar el campo 'encuestado' en el modelo Usuario
      await Usuario.update(
        { encuestado: "si" },
        { where: { customerId } }
      );
  
      res.status(201).json({ message: "Feedback guardado exitosamente y usuario actualizado" });
    } catch (error) {
      console.error("Error guardando feedback o actualizando usuario:", error);
      res.status(500).json({ error: "Error al guardar el feedback y actualizar el usuario" });
    }
  }
};

module.exports = feedbackController;
