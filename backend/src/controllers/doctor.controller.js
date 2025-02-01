const pool = require("../config/db");

// Obtener todos los doctores
const getDoctores = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Doctor");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los doctores" });
  }
};

// Crear un nuevo doctor
const createDoctor = async (req, res) => {
  try {
    const { nombre, apellido, telefono } = req.body;
    const result = await pool.query(
      "INSERT INTO Doctor (Nombre, Apellido, Telefono) VALUES ($1, $2, $3) RETURNING *",
      [nombre, apellido, telefono]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el doctor" });
  }
};

module.exports = { getDoctores, createDoctor };
