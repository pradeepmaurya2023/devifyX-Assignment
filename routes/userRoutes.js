const { Router } = require("express");

const { userSignup, userSignIn } = require("../controllers/userContollers");

const UserRouter = Router();

// User Signup Endpoint
UserRouter.post("/signup", userSignup);

// User Sign In Endpoint
UserRouter.post("/signin", userSignIn);


module.exports = UserRouter;
