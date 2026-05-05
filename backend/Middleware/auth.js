import jwt from "jsonwebtoken";
import User from "../Models/User.js";

const auth = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token" });
  }

  const token = header.startsWith("Bearer ")
    ? header.split(" ")[1]
    : header;

  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(verify.id);
    req.user = user;

    next();
  } catch (err) {
    console.log("jwt error:", err.message); 
    res.status(400).json({ message: "Invalid token" });
  }
};

export default auth;