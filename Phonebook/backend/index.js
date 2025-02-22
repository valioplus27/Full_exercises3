require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');
const app = express();


app.use(express.json());

// Create a custom token to log the request body
morgan.token('body', (req) => JSON.stringify(req.body));

// Configure morgan to use the custom token in the log format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
//app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.static('dist'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons);
    }).catch(error => {
      console.error('Error fetching persons:', error);
      res.status(500).json({ error: 'internal server error' });
    });
});

app.get('/info', (req, res) => {
    Person.countDocuments({}).then(count => {
      const requestTime = new Date();
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${requestTime}</p>
      `);
    }).catch(error => {
      console.error('Error fetching info:', error);
      res.status(500).json({ error: 'internal server error' });
    });
});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    }).catch(error => {
      console.error('Error fetching person by id:', error);
      res.status(400).send({ error: 'malformatted id' });
    });
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
  
    const person = new Person({
      name: body.name,
      number: body.number,
    });
  
    person.save().then(savedPerson => {
      res.json(savedPerson);
    }).catch(error => {
      console.error('Error saving person:', error);
      res.status(500).json({ error: 'internal server error' });
    });
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
