import jwt from "jsonwebtoken";
import SECRET_KEY from "../Config/authConfig.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "User Not Authenticated", success: false });
    }
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid token ", success: false });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log("error from middleware:", error.message);
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token." });
    }
    // Catch-all for other errors
    return res
      .status(500)
      .json({ message: "An error occurred during authentication." });
  }
};
