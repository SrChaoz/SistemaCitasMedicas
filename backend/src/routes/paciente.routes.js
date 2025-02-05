const express = require("express");
const router = express.Router();
const pacienteController = require("../controllers/paciente.controller");

// Obtener todos los pacientes
router.get("/", pacienteController.getPacientes);  

// Crear un nuevo paciente
router.post("/", pacienteController.createPaciente);  

module.exports = router;
