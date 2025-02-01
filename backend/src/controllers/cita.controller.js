const pool = require("../config/db");

// Obtener todas las citas
const getCitas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Cita");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
};

// Crear una nueva cita
const createCita = async (req, res) => {
  try {
    const { paciente_id, doctor_id, fecha, estado } = req.body;
    const result = await pool.query(
      "INSERT INTO Cita (Paciente_ID, Doctor_ID, Fecha, Estado) VALUES ($1, $2, $3, $4) RETURNING *",
      [paciente_id, doctor_id, fecha, estado]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la cita" });
  }
};

module.exports = { getCitas, createCita };
