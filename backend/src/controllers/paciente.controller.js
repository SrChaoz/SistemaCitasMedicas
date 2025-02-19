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
const getPacientePorCedula = async (req, res) => {
  try {
      const { cedula } = req.params;

      const result = await pool.query(
          "SELECT * FROM Paciente WHERE nro_cedula = $1",
          [cedula]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ error: "Paciente no encontrado" });
      }

      res.json(result.rows[0]);
  } catch (error) {
      console.error("Error al buscar paciente:", error);
      res.status(500).json({ error: "Error al buscar paciente" });
  }
};

// Crear un nuevo paciente
const createPaciente = async (req, res) => {
  try {
    // Extraemos todos los datos necesarios
    const { nombre, apellido, telefono, direccion, nro_cedula, genero, peso, altura, fecha_nacimiento } = req.body;

    // Asegúrate de que todos los campos necesarios están presentes
    if (!nombre || !apellido || !telefono || !direccion || !nro_cedula || !genero || !fecha_nacimiento) {
      return res.status(400).json({ error: "Faltan datos requeridos." });
    }

    // Consulta SQL para insertar un nuevo paciente
    const result = await pool.query(
      "INSERT INTO Paciente (nombre, apellido, telefono, direccion, nro_cedula, genero, peso, altura, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [nombre, apellido, telefono, direccion, nro_cedula, genero, peso, altura, fecha_nacimiento]
    );

    // Devolver el paciente creado
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear el paciente:", error);
    res.status(500).json({ error: "Error al crear el paciente" });
  }
};


module.exports = { getPacientes, createPaciente,getPacientePorCedula };
