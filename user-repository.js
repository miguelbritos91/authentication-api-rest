import dbLocal from "db-local";
import bcrypt from "bcrypt";
import { SALT } from "./config.js";
import { Validation } from "./validations.js";
const { Schema } = new dbLocal({ path: "./db" });


const User = Schema("User", {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  birthdate: { type: String, required: true },
});

const formatDate = (birthdate) => {
  const date = new Date(birthdate);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date"); // Manejar caso de fecha inválida
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export class UserRepository {
  static async create({ username, password, name, lastname, birthdate }) {
    // validaciones básicas para username y password
    Validation.username(username);
    Validation.password(password);
    Validation.name(name);
    Validation.lastname(lastname);
    Validation.birthdate(birthdate);
    console.log("birthdate", birthdate);
    // verificar que username no este registrado
    const user = User.findOne({ username });
    if (user) throw new Error("usernameExists");

    const id = crypto.randomUUID();

    const passwordHashed = await bcrypt.hash(password, SALT);

    const birthdateFormated = formatDate(birthdate);
    console.log("birthdateFormated", birthdateFormated);

    User.create({
      _id: id,
      username,
      name,
      lastname,
      birthdate: birthdateFormated,
      password: passwordHashed,
    }).save();

    return id;
  }
  static async login({ username, password }) {
    Validation.username(username);
    Validation.password(password);

    const user = User.findOne({ username });

    if (!user) throw new Error("usernameNotExists");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("passwordInvalid");

    const { password: _, ...publicUser } = user;

    return publicUser;
  }
}
