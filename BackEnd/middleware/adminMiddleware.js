/**
 * Middleware untuk memvalidasi hak akses khusus akun Administrator
 */
const adminMiddleware = (req, res, next) => {
  // req.user diisi oleh authMiddleware setelah mendekode token JWT secara sah
  const userRole = req.user?.role;

  if (userRole !== "admin") {
    return res.status(403).json({
      status: "error",
      message:
        "Akses ditolak. Endpoint ini eksklusif hanya untuk Administrator.",
    });
  }

  next();
};

module.exports = adminMiddleware;
