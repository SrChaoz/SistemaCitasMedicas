const express = require("express");
const router = express.Router();
const citaController = require("../controllers/cita.controller");

// Obtener todas las citas
router.get("/", citaController.getCitas);

// Crear una nueva cita
router.post("/", citaController.createCita);

// Actualizar una cita (cambiar estado)
router.put("/:id", citaController.updateCita);

// Eliminar una cita
router.delete("/:id", citaController.deleteCita);

router.get("/doctor/:id_doctor", citaController.getCitasDoctor);

// Marcar cita como completada
router.put("/:id", citaController.completarCita);

module.exports = router;
