const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decodedToken = jwt.verify(token, "tu_clave_secreta");
    req.userId = decodedToken.userId; // Almacena el ID del usuario en la solicitud
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = verificarToken;
