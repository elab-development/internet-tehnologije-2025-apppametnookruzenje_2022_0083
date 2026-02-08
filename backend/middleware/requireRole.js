function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Niste autentifikovani" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Nemate pravo pristupa" });
    }

    next();
  };
}

module.exports = requireRole;
