const express = require("express");
const superheroes = require("superheroes");
const { engine } = require("express-handlebars");
const PORT = process.env.PORT || 8000;

const app = express();

app.listen(PORT, console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send(superheroes.random());
});
