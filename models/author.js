const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exceptions by returning an empty string

  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("lifespan").get(function () {
  let dob = new Date(this.date_of_birth);
  let dod = new Date(this.date_of_death);

  if (isNaN(dob) && isNaN(dod)) {
    return "Age information not found";
  }

  if (isNaN(dod)) {
    dod = new Date();
  }

  const diffInMs = Math.abs(dod - dob);
  const yearsDiff = Math.round(diffInMs / (1000 * 60 * 60 * 24 * 365.25));

  return yearsDiff;
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
