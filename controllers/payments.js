const fetch = require('node-fetch');
const Payment = require('../models/Payment');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');
const MUUID = require('uuid-mongodb');

const makePayment = async (req, res) => {
   const { billed_amount, exchange_currency, billed_amount: billed } = req.body;
   const mUUID4 = MUUID.v4();
   req.body.id = mUUID4.toString();
   req.body.object = 'payment';

   // const billed = req.body.billed_amount;
   let amount = 0;
   let cambio = 0;
   if (req.body.needs_exchange) {
      let fechaPago = req.body.billed_at;
      fechaPago = fechaPago.split('-').reverse().join('-');

      amount = await fetch(`https://mindicador.cl/api/uf/${fechaPago}`)
         .then(res => res.json())
         .then(data => {
            cambio = data.serie[0].valor;

            return Math.ceil(billed * cambio);
         });

      req.body.echange_currency = 'clp';
      req.body.exchange = {
         original_amount: billed_amount,
         currency: exchange_currency,
         exchange_rate: cambio,
      };
   }

   req.body.amount = amount;

   console.log('body', req.body);

   // creando un Payment
   const payment = await Payment.create(req.body);

   //respuesta a postma/front
   res.status(StatusCodes.CREATED).json({ payment });
};

const getAllPayments = async (req, res) => {
   const payments = await Payment.find();

   res.status(StatusCodes.OK).json(payments);
};

const getSinglePayment = async (req, res) => {
   const {
      params: { id: paymentId },
   } = req;

   const payment = await Payment.findOne({ id: paymentId });

   if (!payment) {
      throw new NotFoundError(`No payment with id: ${paymentId}`);
   }

   res.status(StatusCodes.OK).json(payment);
};

const updatePayment = async (req, res) => {
   const { billed_amount, exchange_currency, billed_amount: billed } = req.body;
   const {
      params: { id: paymentId },
   } = req;

   /////////
   let amount = 0;
   let cambio = 0;
   if (req.body.needs_exchange) {
      let fechaPago = req.body.billed_at;
      fechaPago = fechaPago.split('-').reverse().join('-');

      amount = await fetch(`https://mindicador.cl/api/uf/${fechaPago}`)
         .then(res => res.json())
         .then(data => {
            cambio = data.serie[0].valor;

            return Math.ceil(billed * cambio);
         });

      req.body.echange_currency = 'clp';
      req.body.exchange = {
         original_amount: billed_amount,
         currency: exchange_currency,
         exchange_rate: cambio,
      };
   }

   req.body.amount = amount;
   /////////

   req.body.object = 'payment';

   const payment = await Payment.findOneAndReplace(
      { id: paymentId },
      req.body,
      {
         new: true,
         runValidators: true,
      }
   );

   if (!payment) {
      throw new NotFoundError(`No payment with id: ${paymentId}`);
   }

   res.status(StatusCodes.OK).json({ msg: 'payment sucessfully updated' });
};

const deletePayment = async (req, res) => {
   const {
      params: { id: paymentId },
   } = req;

   const payment = await Payment.findOneAndDelete({ id: paymentId });

   if (!payment) {
      throw new NotFoundError(`No payment with id: ${paymentId}`);
   }

   res.status(StatusCodes.OK).send({ msg: 'payment sucessfully deleted' });
};

module.exports = {
   makePayment,
   getAllPayments,
   getSinglePayment,
   updatePayment,
   deletePayment,
};
