import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user";
import { PasswordManager } from "../services/password_manager";
import jwt from "jsonwebtoken";
import { currentUser, validateRequest } from "../middlewares";
import { BadRequestError } from "../errors";
const router = express.Router();

router.get("/users/currentuser", currentUser, (req, res) => {
  console.log({ currentUser: req.currentUser || null });
  res.send({ currentUser: req.currentUser || null });
});

router.post(
  "/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await PasswordManager.compare(
      password,
      existingUser.password
    );
    if (!passwordsMatch) throw new BadRequestError("Invalid Credentials");
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

router.post("/users/signout", (req, res) => {
  req.session = null;
  res.send({});
});

router.post(
  "/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({
        min: 4,
        max: 20,
      })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email is in use");
    }

    const user = User.build({ email, password });
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as UserRouter };
