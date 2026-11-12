const mongoose = require("mongoose");

const quotationScheme = new mongoose.Schema({
  Customername: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },

  model: {
    type: String,
    required: true,
  },

  Companyname: {
    type: String,
    required: true,
  },

  Quantity: {
    type: String,
    required: true,
    min: 1,
  },

  requirements: {
    type: String,
  },

  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Quotation = mongoose.model("QuoteScheme", quotationScheme);

module.exports = Quotation;
