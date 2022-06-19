const express = require('express');
const router = express.Router();

const {
   makePayment,
   getAllPayments,
   getSinglePayment,
   updatePayment,
   deletePayment,
} = require('../controllers/payments');

// /payments
router.route('/').post(makePayment).get(getAllPayments);
router
   .route('/:id')
   .get(getSinglePayment)
   .put(updatePayment)
   .delete(deletePayment);

module.exports = router;
