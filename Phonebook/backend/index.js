require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');
const middleware = require('./middleware');
const app = express();


app.use(express.json());

// Create a custom token to log the request body
morgan.token('body', (req) => JSON.stringify(req.body));

// Configure morgan to use the custom token in the log format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
//app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.static('dist'))

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
      res.json(persons);
    }).catch(error => next(error));
  });

app.get('/info', (req, res, next) => {
    Person.countDocuments({}).then(count => {
      const requestTime = new Date();
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${requestTime}</p>
      `);
    }).catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    }).catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(() => {
      res.status(204).end();
    }).catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
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
    }).catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;
  
    const person = {
      name: body.name,
      number: body.number,
    };
  
    Person.findByIdAndUpdate(req.params.id, person, number, { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        res.json(updatedPerson);
      })
      .catch(error => next(error));
});

app.use(middleware.unknownEndpoint);


app.use(middleware.errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
