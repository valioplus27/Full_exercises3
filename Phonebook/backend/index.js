const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());

// Create a custom token to log the request body
morgan.token('body', (req) => JSON.stringify(req.body));

// Configure morgan to use the custom token in the log format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
//app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.static('dist'))
let persons = [
    { 
      "id": "1",
      "name": "Valtter Reims", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const numberOfEntries = persons.length;
    const requestTime = new Date();
    res.send(`
        <p>Phonebook has info for ${numberOfEntries} people</p>
        <p>${requestTime}</p>
    `);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const personIndex = persons.findIndex(person => person.id === id);
    if (personIndex !== -1) {
        persons = persons.filter(person => person.id !== id);
        res.status(204).end();
    } else {
        res.status(404).end();
    }
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'name or number missing' 
        });
    }

    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return res.status(400).json({ 
            error: 'name must be unique' 
        });
    }

    const newPerson = {
        id: Math.floor(Math.random() * 1000000).toString(),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(newPerson);
    res.json(newPerson);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
