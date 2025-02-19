const pool = require("../config/db");

// Obtener todas las citas
// Obtener todas las citas (sin filtrar por doctor)
const getCitas = async (req, res) => {
    try {
      // Consulta SQL para obtener todas las citas
      const result = await pool.query(`
          SELECT c.id_cita, c.fecha, c.hora, c.estado, 
                 p.nombre AS paciente, m.nombre AS doctor
          FROM CitaMedica c
          JOIN Paciente p ON c.id_paciente = p.id_paciente
          LEFT JOIN Medico m ON c.id_medico = m.id_medico
      `);
      
      res.json(result.rows); // Devolver todas las citas
    } catch (error) {
      console.error("Error al obtener citas:", error);
      res.status(500).json({ error: "Error al obtener citas médicas" });
    }
  };
  



// Crear una nueva cita
const createCita = async (req, res) => {
  try {
      console.log("Datos recibidos en el backend:", req.body);  //  Depuración

      const { id_paciente, id_medico, fecha, hora, estado } = req.body;

      if (!id_paciente || !id_medico || !fecha || !hora || !estado) {
          return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }

      const result = await pool.query(
        "INSERT INTO CitaMedica (fecha, hora, estado, id_paciente, id_medico) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [fecha, hora, estado, id_paciente, id_medico]
      );

      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error("Error al crear cita:", error);
      res.status(500).json({ error: "Error al crear la cita" });
  }
};


// Actualizar una cita cambiar estado
const updateCita = async (req, res) => {
  try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!estado) {
          return res.status(400).json({ error: "El estado es obligatorio" });
      }

      const result = await pool.query(
          "UPDATE Cita SET Estado = $1 WHERE ID_Cita = $2 RETURNING *",
          [estado, id]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ error: "Cita no encontrada" });
      }

      console.log(" Cita actualizada en la base de datos:", result.rows[0]); // Depuración
      res.json(result.rows[0]);
  } catch (error) {
      console.error("Error al actualizar cita:", error);
      res.status(500).json({ error: "Error al actualizar la cita" });
  }
};


// Eliminar una cita
const deleteCita = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query("DELETE FROM Cita WHERE ID_Cita = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        res.json({ message: "Cita eliminada exitosamente" });
    } catch (error) {
        console.error("Error al eliminar cita:", error);
        res.status(500).json({ error: "Error al eliminar la cita" });
    }
};


// Obtener citas de un doctor
const getCitasDoctor = async (req, res) => {
    try {
        const { id_medico } = req.params;  // Obtener el parámetro de la ruta

        // Asegúrate de que el id_medico esté disponible
        console.log("ID del doctor recibido:", id_medico);

        // Consulta para obtener las citas del médico
        const result = await pool.query(`
            SELECT c.id_cita, c.fecha, c.hora, c.estado, 
                   p.nombre AS paciente
            FROM CitaMedica c
            JOIN Paciente p ON c.id_paciente = p.id_paciente
            WHERE c.id_medico = $1
        `, [id_medico]);

        console.log("Citas obtenidas para el doctor:", result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener citas del doctor:", error);
        res.status(500).json({ error: "Error al obtener citas del doctor" });
    }
};


// Marcar cita como completada
const completarCita = async (req, res) => {
    try {
        const {id} = req.params; // Obtén el ID de la cita desde los parámetros de la ruta

        // Actualizar el estado de la cita a 'Completada'
        const result = await pool.query(
            "UPDATE CitaMedica SET estado = 'Completada' WHERE id_cita = $1 RETURNING *", 
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        res.json({ message: "Cita completada correctamente", cita: result.rows[0] });
    } catch (error) {
        console.error("Error al actualizar cita:", error);
        res.status(500).json({ error: "Error al actualizar la cita" });
    }
};



module.exports = { getCitas, createCita, updateCita, deleteCita,getCitasDoctor, completarCita  };
