const interviewsModel = require("../models/interviews.model");

// GET /interviews
const getAllInterviews = async (req, res) => {
  try {
    const interviews = await interviewsModel.getAllInterviews();

    res.json(interviews);
  } catch (error) {
    console.error("Error al obtener entrevistas:", error);
    res.status(500).json({ message: "Error al obtener entrevistas" });
  }
};

// GET /interviews/:id
const getInterviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const interview = await interviewsModel.getInterviewById(id);

    if (!interview) {
      return res.status(404).json({ message: "Entrevista no encontrada" });
    }

    res.json(interview);
  } catch (error) {
    console.error("Error al obtener entrevista:", error);
    res.status(500).json({ message: "Error al obtener entrevista" });
  }
};

// POST /interviews
const createInterview = async (req, res) => {
  const { application_id, scheduled_at, type, notes, status } = req.body;

  if (!application_id) {
    return res.status(400).json({
      message: "application_id es obligatorio",
    });
  }

  try {
    const interview = await interviewsModel.createInterview(
      application_id,
      scheduled_at,
      type,
      notes,
      status
    );

    res.status(201).json({
      message: "Entrevista creada correctamente",
      interview,
    });
  } catch (error) {
    console.error("Error al crear entrevista:", error);

    if (error.code === "23503") {
      return res.status(400).json({
        message: "application_id no existe",
      });
    }

    if (error.code === "22P02") {
      return res.status(400).json({
        message: "Valor inválido para type o status",
      });
    }

    res.status(500).json({ message: "Error al crear entrevista" });
  }
};

// PUT /interviews/:id
const updateInterview = async (req, res) => {
  const { id } = req.params;
  const { scheduled_at, type, notes, status } = req.body;

  if (!scheduled_at && !type && !notes && !status) {
    return res.status(400).json({
      message: "Debes enviar al menos un campo para actualizar",
    });
  }

  try {
    const interview = await interviewsModel.updateInterview(
      id,
      scheduled_at,
      type,
      notes,
      status
    );

    if (!interview) {
      return res.status(404).json({ message: "Entrevista no encontrada" });
    }

    res.json({
      message: "Entrevista actualizada correctamente",
      interview,
    });
  } catch (error) {
    console.error("Error al actualizar entrevista:", error);

    if (error.code === "22P02") {
      return res.status(400).json({
        message: "Valor inválido para type o status",
      });
    }

    res.status(500).json({ message: "Error al actualizar entrevista" });
  }
};

// DELETE /interviews/:id
const deleteInterview = async (req, res) => {
  const { id } = req.params;

  try {
    const interview = await interviewsModel.deleteInterview(id);

    if (!interview) {
      return res.status(404).json({ message: "Entrevista no encontrada" });
    }

    res.json({
      message: "Entrevista eliminada correctamente",
      interview,
    });
  } catch (error) {
    console.error("Error al eliminar entrevista:", error);
    res.status(500).json({ message: "Error al eliminar entrevista" });
  }
};

module.exports = {
  getAllInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
};