export class Validation {
  static username(username) {
    if (typeof username != "string") throw new Error("usernameType");
    if (username.length < 4) throw new Error("usernameLong");
  }

  static password(password) {
    if (typeof password != "string") throw new Error("passwordType");
    if (password.length < 6) throw new Error("passwordLong");
  }
}
