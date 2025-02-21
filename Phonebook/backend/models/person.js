const mongoose = require('mongoose');
require('dotenv').config();

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.set('strictQuery', false);

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    // List all entries
    Person.find({}).then(result => {
      console.log('phonebook:');
      result.forEach(person => {
        console.log(person.name, person.number);
      });
      mongoose.connection.close();
    });
  } else if (process.argv.length === 5) {
    // Add a new entry
    const person = new Person({
      name: name,
      number: number,
    });
  
    person.save().then(result => {
      console.log(`added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    });
  } else {
    console.log('Invalid number of arguments');
    mongoose.connection.close();
  }

module.exports = mongoose.model('Person', personSchema);