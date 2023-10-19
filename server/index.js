const express = require("express");
const app = express();
const mysql = require("mysql2");
const port = 3001;
const cors = require("cors");

const { encrypt, decrypt } = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "PasswordManager",
});

app.post("/addpassword", (req, res) => {
  const { password, title, username } = req.body;
  const hashedPassword = encrypt(password);

  db.query(
    "INSERT INTO passwords (password, title, username, iv) VALUES (?,?,?,?)",
    [hashedPassword.password, title, username, hashedPassword.iv],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.get("/getpasswords", (req, res) => {
  db.query("SELECT * FROM passwords;", (err, result) => {
		if (err)
			console.log(err);
		else
			res.send(result);
  });
});

app.post("/decryptpassword", (req, res) => {
	res.send(decrypt(req.body));
})

app.listen(port, () => console.log("Running"));
