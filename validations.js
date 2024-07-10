export class Validation {
  static username(username) {
    if (typeof username != "string") throw new Error("usernameType");
    if (username.length < 4) throw new Error("usernameLong");
  }

  static password(password) {
    if (typeof password != "string") throw new Error("passwordType");
    if (password.length < 6) throw new Error("passwordLong");
  }

  static name(name) {
    if (name == undefined || name == null || name == "") throw new Error("nameRequired");
    if (typeof name != "string") throw new Error("nameType");
  }

  static lastname(lastname) {
    if (lastname == undefined || lastname == null || lastname == "") throw new Error("lastnameRequired");
    if (typeof lastname != "string") throw new Error("lastnameType");
  }

  static birthdate(birthdate) {
    if (birthdate == undefined || birthdate == null || birthdate == "")
      throw new Error("birthdateRequired");
    if (typeof birthdate != "string") throw new Error("birthdateType");
  }
}
