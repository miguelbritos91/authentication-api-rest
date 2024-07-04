import express from "express";
import { PORT } from "./config.js"; // Adjust the path if necessary
import { UserRepository } from "./user-repository.js";
import { errors } from "./errors-message.js";

const app = express();
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/login", (req, res) => {
  res.json({user: "miguel"})
});

app.post("/register", async (req, res) => {
  const {username, password} = req.body
  const response = {ok: false, msg: 'Error create new user', id: null}
  try {
    const id = await UserRepository.create({username, password})
    if(id){
      response.ok = true;
      response.msg = 'New user create'
      response.id = id;
    }
    res.status(200).json(response)
  } catch (error) {
    const err = error.toString().substring(7);
    if(errors[`${err}`]){
      response.msg += ': ' + errors[`${err}`]
    }else{
      console.log("error en create user:", error.toString());
    }
    res.status(400).json(response)
  }
});

app.get("/protected", (req, res) => {
  res.send("pagina protegida");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
