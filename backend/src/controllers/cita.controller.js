const pool = require("../config/db");

// Obtener todas las citas
const getCitas = async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT c.ID_Cita, c.Fecha, c.Hora, c.Estado, 
                 p.Nombre AS Paciente, d.Nombre AS Doctor
          FROM Cita c
          JOIN Paciente p ON c.ID_Paciente = p.ID_Paciente
          JOIN Doctor d ON c.ID_Doctor = d.ID_Doctor
      `);
      
      console.log("Citas obtenidas:", result.rows); // Depuración
      res.json(result.rows);
  } catch (error) {
      console.error("Error al obtener citas:", error);
      res.status(500).json({ error: "Error al obtener las citas" });
  }
};


// Crear una nueva cita
const createCita = async (req, res) => {
  try {
      console.log("Datos recibidos en el backend:", req.body);  //  Depuración

      const { id_paciente, id_doctor, fecha, hora, estado } = req.body;

      if (!id_paciente || !id_doctor || !fecha || !hora || !estado) {
          return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }

      const result = await pool.query(
          "INSERT INTO Cita (Fecha, Hora, Estado, ID_Paciente, ID_Doctor) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [fecha, hora, estado, id_paciente, id_doctor]
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
        const { id_doctor } = req.params;

        const result = await pool.query(`
            SELECT c.ID_Cita, c.Fecha, c.Hora, c.Estado, 
                   p.Nombre AS paciente
            FROM Cita c
            JOIN Paciente p ON c.ID_Paciente = p.ID_Paciente
            WHERE c.ID_Doctor = $1
        `, [id_doctor]);

        console.log("Citas obtenidas para el doctor:", result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error(" Error al obtener citas del doctor:", error);
        res.status(500).json({ error: "Error al obtener citas del doctor" });
    }
};

// Marcar cita como completada
const completarCita = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "UPDATE Cita SET Estado = 'Completada' WHERE ID_Cita = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        res.json({ message: "Cita marcada como completada", cita: result.rows[0] });
    } catch (error) {
        console.error(" Error al actualizar cita:", error);
        res.status(500).json({ error: "Error al actualizar la cita" });
    }
};


module.exports = { getCitas, createCita, updateCita, deleteCita,getCitasDoctor, completarCita  };
