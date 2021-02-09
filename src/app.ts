import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError } from "./errors";
import { currentUser, errorHandler } from "./middlewares";
import { UserRouter } from "./routes/user";
import { TicketRouter } from "./routes/tickets";
import { UploadRouter } from "./routes/upload";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    // secure: process.env.NODE_ENV !== "test",
    // Need to set this to true so we can only receive cookie from https requests...
  })
);
app.use(currentUser);
app.use(UserRouter);
app.use(TicketRouter);
app.use(UploadRouter);
app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
