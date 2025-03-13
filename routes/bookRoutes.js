const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.get("/", async (req, res) => {
  try {
    const books = await Book.find();

    res.render("books/index", {
      books,
    });
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération des livres");
  }
});

router.get("/new", (req, res) => {
  res.render("books/new", { errors: [], book: {} });
});

router.post("/", async (req, res) => {
  try {
    const { title, author, year, summary } = req.body;

    const errors = [];
    if (!title || title.trim() === "") errors.push("Le titre est obligatoire.");
    if (!author || author.trim() === "")
      errors.push("L'auteur est obligatoire.");
    if (!year || year > new Date().getFullYear())
      errors.push(
        "L'année de publication ne peut pas être supérieure à l'année actuelle."
      );
    if (summary && summary.length > 500)
      errors.push("Le résumé ne doit pas dépasser 500 caractères.");

    if (errors.length > 0) {
      return res.render("books/new", { errors, book: req.body });
    }

    await Book.create({ title, author, year, summary });
    res.redirect("/books");
  } catch (err) {
    res.status(500).send("Erreur lors de l'ajout du livre");
  }
});

router.put("/:id", async (req, res) => {
  console.log("Modification du livre");
  const { title, author, year, summary } = req.body;

  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, year, summary },
      { new: true }
    );

    if (!book) {
      return res.status(404).send("Livre non trouvé");
    }

    res.redirect(`/books/${book._id}`);
  } catch (err) {
    res.status(400).send("Erreur lors de la mise à jour du livre");
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send("Livre non trouvé");

    res.render("books/edit", { errors: [], book });
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id?.toString();
    if (!id) return res.status(400).send("ID invalide");

    const book = await Book.findById(id);
    if (!book) return res.status(404).send("Livre non trouvé");

    res.render("books/shows", {
      book,
    });
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("/books");
  } catch (err) {
    res.status(404).send("Livre non trouvé");
  }
});

module.exports = router;
