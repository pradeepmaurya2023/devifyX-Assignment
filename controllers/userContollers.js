const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const User = require("../models/User");

// will send same strucuter response
const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({ message, ...(data && { data }) });
};

// User Signup Endpoint Controller
async function userSignup(req, res) {
  const schema = z.object({
    name: z.string().nonempty().min(3).max(30).trim(),
    email: z.string().email().trim().min(3).max(30),
    password: z.string().nonempty().min(8).max(30).trim(),
  });

  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    return sendResponse(res, 422, "Invalid input", {
      errors: validation.error.flatten(),
    });
  }

  const { name, email, password } = validation.data;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 409, "Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return sendResponse(res, 201, "User signed up successfully");
  } catch (err) {
    console.error("Signup error:", err);
    return sendResponse(res, 500, "Internal server error");
  }
}

// User Sign In Endpoint
async function userSignIn(req, res) {
  const schema = z.object({
    email: z.string().email().trim().min(3).max(30),
    password: z.string().nonempty().min(8).max(30).trim(),
  });

  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    return sendResponse(res, 422, "Invalid input", {
      errors: validation.error.flatten(),
    });
  }

  const { email, password } = validation.data;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return sendResponse(res, 200, "Sign in successful", { token });
  } catch (err) {
    console.error("Signin error:", err);
    return sendResponse(res, 500, "Internal server error");
  }
}
module.exports = {
  userSignup,
  userSignIn,
};
