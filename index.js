import express from "express";
import { PORT, NODE_ENV, SECRET_TOKEN } from "./config.js"; // Adjust the path if necessary
import { UserRepository } from "./user-repository.js";
import { errors } from "./errors-message.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.redirect("/login");
  }

  jwt.verify(token, SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.redirect("/login");
    }
    req.user = decoded;
    next();
  });
};

const noLogged = (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    jwt.verify(token, SECRET_TOKEN, (err, decoded) => {
      if (err) {
        next();
      }
      req.user = decoded;
      return res.redirect("/");
    });
  }
  next();
};

app.get("/", verifyToken, (req, res) => {
  res.render("dashboard", { user: req.user });
});

app.get("/login", noLogged, (req, res) => {
  res.render("login");
});

app.get("/register", noLogged, (req, res) => {
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

app.post("/logout", verifyToken, async (req, res) => {
  const response = { ok: false, msg: "Error logiut user" };
  try {
    response.ok = true;
    response.msg = "User logged out";
    res.clearCookie("access_token").status(200).json(response);
  } catch (error) {
    if (errors[error.message]) {
      response.msg += ": " + errors[error.message];
    } else {
      console.log("error en create user:", error.message);
    }
    res.status(401).json(response);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
