import jwt from "jsonwebtoken";
import { ROLE } from "../models/user.enums.js";
import validator from "validator";
export function ensureUser(req, res, next) {
  try {

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decodedToken.user.id,
            email: decodedToken.user.email,
            role: decodedToken.user.role,
        };
        next();
    } catch (err) {
        res.status(401).json({
            //message: 'Auth failed',
            message: err.message,
        });
    }
}
export function ensureLoggedIn(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.user.id;
    const name = decodedToken.user.name;
    const email = decodedToken.user.email;
    const role = decodedToken.user.role;
    var user = req.params.param;
    if (
      user.toString() !== name.toString() &&
      user.toString() !== email.toString() &&
      user.toString() !== id.toString() &&
      user.toString() !== role.toString()
    ) {
      return res.status(401).json({
        message: "Invalid token",
      });
    } else {
      next();
    }
  } catch (err) {
    return res.status(500).json({
      error: new Error("Invalid request!"),
    });
  }
}

export function ensureAdmin(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.user.role !== ROLE.ADMIN) {
      return res.status(401).json({
        message: "You are not an admin to perform this action",
      });
    } else {
      next();
    }
  } catch (err) {
    return res.status(500).json({
      error: new Error("Invalid request!"),
    });
  }
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  // Check that the email and password are not empty
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  // Check that the email is a valid email address
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  if (password.length > 100) {
    return res
      .status(400)
      .json({ message: "Password must be less than 100 characters." });
  }

  if (email.length > 100) {
    return res
      .status(400)
      .json({ message: "Email must be less than 256 characters." });
  }

  next();
}

export function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/user/api/sessions/oauth/google");
  }
}
