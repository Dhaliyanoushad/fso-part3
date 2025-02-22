// Purpose: Backend server for phonebook app

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Contact = require("./models/contacts");

const PORT = process.env.PORT || 3001;

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.static("dist")); //The application can now be used from the backend address http://localhost:3001
app.use(cors());
app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  // response.json(persons);
  Contact.find({}).then((result) => {
    response.json(result);
  });
}); //The application can now be used from the backend address http://localhost:3001/api/persons

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  Contact.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      response.status(400).send({ error: "malformatted id" });
    });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save().then((result) => {
    response.json(result);
  });
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentDate}</p>
    `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);
