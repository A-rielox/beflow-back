const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
   id: {
      type: String,
      required: [true, 'Please provide an id'],
   },
   object: {
      type: String,
      required: [true, 'Please provide a valid object'],
   },
   description: {
      type: String,
   },
   billed_hours: {
      type: Number,
      required: [true, 'Please provide a decimal value'],
   },
   billed_at: {
      type: String,
      required: [true, 'Please provide a valid date'],
   },
   billing_currency: {
      type: String,
      required: [true, 'Please provide a valid currency type'],
   },
   billed_amount: {
      type: Number,
      required: [true, 'Please provide a valid amount'],
   },
   amount: {
      type: Number,
   }, // "amount": 45000, // integer, populated automatically on creation
   currency: {
      type: String,
      default: 'clp',
   }, // 	"currency": "clp", // string, populated automatically on creation
   needs_exchange: {
      type: Boolean,
      required: [true, 'Please provide a valid field'],
   },
   exchange_currency: {
      type: String,
   }, // "echange_currency": "clp, // string, required if needs_exchange is true
   exchange: {
      original_amount: { type: Number },
      currency: { type: String },
      exchange_rate: { type: Number },
   },
});

module.exports = mongoose.model('Payment', PaymentSchema);
