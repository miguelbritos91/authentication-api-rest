import dbLocal from "db-local";
import bcrypt from "bcrypt";
import { SALT } from "./config.js";
import { Validation } from "./validations.js";

const { Schema } = new dbLocal({ path: "./db" });

const User = Schema("User", {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export class UserRepository {
  static async create({ username, password }) {
    // validaciones básicas para username y password
    Validation.username(username)
    Validation.password(password)
    // verificar que username no este registrado
    const user = User.findOne({ username });
    if (user) throw new Error("usernameExists");

    const id = crypto.randomUUID();

    const passwordHashed = await bcrypt.hash(password, SALT)
    
    User.create({
      _id: id,
      username,
      password:passwordHashed,
    }).save();

    return id;
  }
  static login({ username, password }) {
    Validation.username(username)
    Validation.password(password)
  }
}