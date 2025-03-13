const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Le titre est requis"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "L'auteur est requis"],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, "L'année est requise"],
    min: [1800, "L'année doit être supérieure à 1800"],
    max: [new Date().getFullYear(), "L'année ne peut pas être dans le futur"],
  },
  summary: {
    type: String,
    maxlength: [500, "Le résumé ne peut pas dépasser 500 caractères"],
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
