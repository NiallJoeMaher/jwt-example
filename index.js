const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const PORT = 3000;

// Our "database" for simplicity
const users = [
  { id: 1, username: "nialljoemaher", password: "securepassword" },
];

app.use(bodyParser.json()); // for parsing application/json

const SECRET = "somesupersecretkey"; // Should be stored in environment variables and "super" private

app.post("/login", (req, res) => {
  // In a real app, you'd need to verify username and password, but we are learning JWTs!
  const user = users.find((u) => u.username === req.body.username);

  if (!user) return res.sendStatus(401); // No user no access

  const payload = { id: user.id, username: user.username };

  const token = jwt.sign(payload, SECRET, { expiresIn: "1h" }); // Sign a token

  res.json({ token });
});

app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>

    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden

      req.user = user;

      next(); // pass the execution off to whatever request the client intended
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
});

// Protected route
app.get("/protected", (req, res) => {
  res.json({ message: "You are in the protected route!", user: req.user });
});

app.listen(PORT, () => console.log("Server is running on PORT:", PORT));
