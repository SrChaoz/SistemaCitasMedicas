const express = require("express");
const router = express.Router();
const pacienteController = require("../controllers/paciente.controller");

// Obtener todos los pacientes
router.get("/", pacienteController.getPacientes);  // Cambiado de "/pacientes" a "/"

// Crear un nuevo paciente
router.post("/", pacienteController.createPaciente);  // Cambiado de "/pacientes" a "/"

module.exports = router;
