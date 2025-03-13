require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const Book = require("./models/Book");

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use("/books", bookRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/bibliotheque")
  .then(() => console.log("Connexion réussie à MongoDB"))
  .catch((err) => {
    console.error("❌ Impossible de se connecter à MongoDB :", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'application de gestion de bibliothèque");
});

console.log("Route /test-book enregistrée");

app.get("/test-book", async (req, res) => {
  console.log(
    "Routes enregistrées :",
    app._router.stack.map((r) => r.route && r.route.path).filter((r) => r)
  );

  try {
    const book = new Book({
      title: "Livre Test",
      author: "Auteur Test",
      year: 2024,
      summary: "Résumé du livre test",
    });
    await book.save();
    res.send("Livre ajouté avec succès");
  } catch (err) {
    console.error("Erreur lors de l'ajout du livre", err.message);
    res.status(400).send(err.message);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http: //localhost:${PORT}`);
});
