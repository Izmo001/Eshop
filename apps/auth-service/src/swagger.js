const swaggerAutogen = require('swagger-autogen')();



const doc = {
  info: {
    title: 'Auth Service API',
    description: 'Automatically generated swagger documentation for the Auth Service API',
    version: '1.0.0'
  },
  host: 'localhost:6001',
  basePath: '/api',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/auth.router.ts']; // if confirmed
// Adjust this path to your actual route file

swaggerAutogen(outputFile, endpointsFiles, doc);
