const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
   // set default
   let customError = {
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || 'Something went wrong, please try again later',
   };

   // por si fallan las validaciones que puse en Schema, y para cuando falta algún campo indicado en la prueba como "required"
   if (err.name === 'ValidationError') {
      customError.msg = Object.values(err.errors)
         .map(item => item.message)
         .join(',');
      customError.statusCode = 400;
   }

   // si no encuentra el item buscado
   if (err.name === 'CastError') {
      customError.msg = `No item found with id ${err.value}`;
      customError.statusCode = 404;
   }

   return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
