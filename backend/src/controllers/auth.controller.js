const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password, rol } = req.body;  // Recibimos el rol desde el frontend
    
    console.log('Recibiendo datos:', { username, password, rol });  // Log para verificar los datos

    // Consultar el usuario en la base de datos
    const result = await pool.query("SELECT * FROM Usuario WHERE nombre_usuario = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    console.log('Usuario encontrado en la base de datos:', user);  // Verificar qué datos obtenemos

    // Comparar la contraseña en texto plano
    if (user.contrasena !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Verificar si el rol enviado desde el frontend coincide con el rol en la base de datos
    if (user.rol !== rol) {
      return res.status(401).json({ error: "Rol incorrecto" });
    }

    // Si el usuario es un médico, recuperar las citas
    let citas = [];
    if (user.rol === 'medico') {
      const citasResult = await pool.query("SELECT * FROM CitaMedica WHERE id_medico = $1", [user.id_medico]);
      citas = citasResult.rows;
    }

    // Devolver los detalles del usuario y las citas si es un médico
    res.json({
      id_usuario: user.id_usuario,
      rol: user.rol,
      citas: citas,
      id_medico: user.id_medico || null,
    });

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: "Error en el inicio de sesión" });
  }
};

module.exports = { login };
