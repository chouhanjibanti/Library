import jwt from "jsonwebtoken";
import JWT_SECRET from "../Config/authConfig.js";

export const generateToken = (res, user, message) => {
  const payload = {
    userId: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

 return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      user,
      message,
    });
};
