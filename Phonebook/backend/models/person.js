const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Custom validator for phone numbers
        // Format: XX-XXXXXX or XXX-XXXXX
        // - Two parts separated by hyphen
        // - First part: 2-3 numbers
        // - Second part: rest of the numbers
        // - Total length at least 8
        return /^(\d{2,3})-(\d+)$/.test(v) && v.length >= 8;
      },
      message: props => `${props.value} is not a valid phone number! Phone number must be at least 8 digits long and in format XX-XXXXXX or XXX-XXXXX`
    }
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema);