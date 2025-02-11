require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");
const { default: persons } = require("./puhelinluettelo/src/services/persons");

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(
  morgan("method :url :status :res[content-length] - :response-time ms :body")
);

morgan.token("type", function (req, res) {
  return req.headers["content-type"];
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  const date = Date();
  const tableLength = Person.length;
  response.send(
    `<p>Phonebook has info for ${tableLength} people.</p><p>${date}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

const generateId = () => {
  const minCeiled = Math.ceil(persons.length);
  const maxFloored = Math.floor(500);

  const randomId = Math.floor(
    Math.random() * (maxFloored - minCeiled) + minCeiled
  );

  return String(randomId);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  /*
  const findPerson = persons.find((person) => person.name === body.name);

  if (findPerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  */

  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: "number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
