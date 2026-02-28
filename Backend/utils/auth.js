const jwt = require("jsonwebtoken");
const config = require("./config");

function authUser(req, res, next) {

  // ✅ Public Routes
  if (
    req.url.startsWith("/foods") ||   // food listing public
    req.url === "/users/signup" ||
    req.url === "/users/signin"
  ) {
    return next();
  }

  const token = req.headers.token;

  if (!token) {
    return res.send({
      status: "error",
      error: "Login required. Token missing",
    });
  }

  try {
    const payload = jwt.verify(token, config.SECRET);

    // Save user info in request
    req.user = {
      email: payload.email,
      mobileNo: payload.mobileNo,
      role: payload.role,
    };

    next();
  } catch (err) {
    return res.send({
      status: "error",
      error: "Invalid or Expired Token",
    });
  }
}


// ✅ Admin Authorization (Optional)
function checkAuthorization(req, res, next) {
  if (req.user.role === "admin") {
    return next();
  }

  return res.send({
    status: "error",
    error: "Unauthorized access (Admin only)",
  });
}

module.exports = { authUser, checkAuthorization };