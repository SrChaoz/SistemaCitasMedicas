const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query("SELECT * FROM usuarios WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user.id, role: user.rol }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: user.rol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el login" });
  }
};

module.exports = { login };
