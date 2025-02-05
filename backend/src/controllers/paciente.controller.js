const pool = require("../config/db");

// Obtener todos los pacientes
const getPacientes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Paciente");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los pacientes" });
  }
};

// Crear un nuevo paciente
const createPaciente = async (req, res) => {
  try {
    const { nombre, apellido, telefono, direccion } = req.body; 
    const result = await pool.query(
      "INSERT INTO Paciente (Nombre, Apellido, Telefono, Direccion) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, apellido, telefono, direccion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el paciente" });
  }
};

module.exports = { getPacientes, createPaciente };
