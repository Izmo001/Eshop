import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {  
    title: "Auth Service API", // API title
    description: "API documentation for the Auth Service", // API description
    },
    host: "localhost:6001",
    schemes: ["http"],
};

const outputFile= "./swagger-output.json";
const endpointsFiles= ["./routes/auth.router.ts"];

swaggerAutogen()(outputFile, endpointsFiles,doc);// Hostnames