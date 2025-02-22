// Purpose: Backend server for phonebook app

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Contact = require("./models/contacts");

const PORT = process.env.PORT || 3001;

app.use(express.static("dist")); //The application can now be used from the backend address http://localhost:3001
app.use(cors());
app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// This is the token that we defined in the previous part
// We want to log the body of POST requests
// morgan.token("body", (req) =>
//   req.method === "POST" && req.body ? req.body.name : ""
// );
// app.use(
//   morgan(":method :url :status :res[content-length] - :response-time ms :body")
// );

let persons = [
  {
    id: 1,
    name: "Arto Hello",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Lucifer",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Sun",
    number: "39-23-6423122",
  },
];

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
  // const id = Number(request.params.id);
  // persons = persons.filter((person) => person.id !== id);

  // response.status(204).end();
  Contact.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      response.status(400).send({ error: "malformatted id" });
    });
});

app.post("/api/persons", (request, response) => {
  // const body = request.body;

  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: "name or number is missing",
  //   });
  // }

  // if (persons.find((person) => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  // const person = {
  //   id: persons.length + 1,
  //   name: body.name,
  //   number: body.number,
  // };

  // persons = persons.concat(person);
  // response.json(person);

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
