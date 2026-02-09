function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Niste autentifikovani" });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Neispravan Authorization header" });
  }

  if (token !== "fake-jwt-token") {
    return res.status(401).json({ message: "Token nije validan" });
  }

  req.user = { email: "test@test.com", role: "PARENT" };
  next();
}

module.exports = requireAuth;