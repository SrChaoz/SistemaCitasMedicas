const pool = require("../config/db");

// Obtener todos los doctores
const getDoctores = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Medico");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los doctores" });
  }
};

// Crear un nuevo doctor
const createDoctor = async (req, res) => {
  try {
    const { nombre, apellido, telefono, especialidad, nro_cedula, nombre_usuario, contrasena, rol } = req.body;

    // Primero, insertar el médico
    const resultMedico = await pool.query(
      "INSERT INTO Medico (nombre, apellido, telefono, especialidad, nro_cedula) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nombre, apellido, telefono, especialidad, nro_cedula]
    );
    
    const medico = resultMedico.rows[0];

    // Luego, insertar el usuario asociado al médico
    const resultUsuario = await pool.query(
      "INSERT INTO Usuario (nombre_usuario, contrasena, rol, id_medico, nombre, apellido) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nombre_usuario, contrasena, rol, medico.id_medico, nombre, apellido]
    );

    res.json({
      message: "Doctor y usuario registrados correctamente",
      doctor: resultMedico.rows[0],
      usuario: resultUsuario.rows[0]
    });
  } catch (error) {
    console.error("Error al crear el doctor y usuario:", error);
    res.status(500).json({ error: "Error al crear el doctor y usuario" });
  }
};


module.exports = { getDoctores, createDoctor };
