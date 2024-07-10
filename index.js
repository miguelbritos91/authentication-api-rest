import express from "express";
import { PORT, NODE_ENV, SECRET_TOKEN } from "./config.js"; // Adjust the path if necessary
import { UserRepository } from "./user-repository.js";
import { errors } from "./errors-message.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  const token = req.cookies.access_token;

  req.session = { user: null };

  try {
    const data = jwt.verify(token, SECRET_TOKEN);
    req.session.user = data;
  } catch (error) {}

  next();
});

app.get("/", (req, res) => {
  if(req.session.user === null){
    return res.redirect("/login");
  }
  res.render("dashboard", { user: req.session.user });
});

app.get("/login", (req, res) => {
  if(req.session.user != null){
    return res.redirect("/");
  }
  res.render("login");
});

app.get("/register", (req, res) => {
  if(req.session.user != null){
    return res.redirect("/");
  }
  res.render("register");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const response = { ok: false, msg: "Error login user", user: null };
  try {
    const user = await UserRepository.login({ username, password });
    if (user) {
      response.ok = true;
      response.msg = "User logged";
      response.user = user;
    }
    const token = jwt.sign(user, SECRET_TOKEN, { expiresIn: "1h" });

    res
      .status(200)
      .cookie("access_token", token, {
        httppOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .json(response);
  } catch (error) {
    if (errors[error.message]) {
      response.msg += ": " + errors[error.message];
    } else {
      console.log("error en create user:", error.message);
    }
    res.status(401).json(response);
  }
});

app.post("/register", async (req, res) => {
  const { username, password, name, lastname, birthdate } = req.body;
  const response = { ok: false, msg: "Error create new user", id: null };
  try {
    const id = await UserRepository.create({
      username,
      password,
      name,
      lastname,
      birthdate,
    });
    if (id) {
      response.ok = true;
      response.msg = "New user create";
      response.id = id;
    }

    const user = await UserRepository.login({ username, password });
    if (user) {
      response.ok = true;
      response.msg = "User logged";
      response.user = user;
    }
    const token = jwt.sign(user, SECRET_TOKEN, { expiresIn: "1h" });

    res
      .status(200)
      .cookie("access_token", token, {
        httppOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .json(response);
  } catch (error) {
    if (errors[error.message]) {
      response.msg += ": " + errors[error.message];
    } else {
      response.msg += ": " + error.message;
      console.log("error en create user:", error.message);
    }
    res.status(400).json(response);
  }
});

app.post("/logout", async (req, res) => {
  const response = { ok: true, msg: "Logout successful" };
  res.clearCookie("access_token").status(200).json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
