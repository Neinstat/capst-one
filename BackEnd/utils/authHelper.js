/**
 * Memvalidasi apakah user memiliki hak akses sebagai Alumni atau Admin
 * @param {string} role - Role user dari database (mahasiswa, alumni, admin)
 * @returns {boolean}
 */
function checkIsAlumniOrAdmin(role) {
  if (!role) return false;

  const userRole = String(role).toLowerCase();
  // Mengizinkan jika role adalah alumni atau admin
  return userRole === "alumni" || userRole === "admin";
}

module.exports = { checkIsAlumniOrAdmin };
