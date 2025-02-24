import { useState, useEffect } from 'react';
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import personService from './services/persons';
import Notification from './Notification';
import './App.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({ message: null, type: '' });

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        // Ensure we're setting an array
        console.log('API response:', response.data);
        setPersons(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error('Error fetching persons:', error);
        setPersons([]); // Set empty array on error
        setNotification({
          message: 'Error fetching persons from server',
          type: 'error'
        });
        setTimeout(() => {
          setNotification({ message: null, type: '' });
        }, 5000);
      });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(existingPerson.id, updatedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data));
            setNewName('');
            setNewNumber('');
            setNotification({ message: `Updated ${newName}'s number`, type: 'success' });
            setTimeout(() => {
              setNotification({ message: null, type: '' });
            }, 5000);
          })
          .catch(error => {
            console.error('Error updating person:', error);
            setNotification({ message: error.response.data.error, type: 'error' });
            setTimeout(() => {
              setNotification({ message: null, type: '' });
            }, 5000);
          });
      }
    } else {
    const newPerson = { name: newName, number: newNumber };
    personService
      .create(newPerson)
      .then(response => {
        setPersons(persons.concat(response.data));
        setNewName('');
        setNewNumber('');
        setNotification({
          message: `Added ${newName}`,
          type: 'success'
        });
        setTimeout(() => {
          setNotification({ message: null, type: '' });
        }, 5000);
      })
      .catch(error => {
        console.error('Error:', error);
        const errorMessage = error.response?.data?.error;
        setNotification({
          message: errorMessage,
          type: 'error'
        });
        setTimeout(() => {
          setNotification({ message: null, type: '' });
        }, 5000);
      });
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setNotification({ message: `Deleted ${name}`, type: 'success' });
          setTimeout(() => {
            setNotification({ message: null, type: '' });
          }, 5000);
        })
        .catch(error => {
          console.error('Error deleting person:', error);
          setNotification({ message: `Failed to delete ${name}`, type: 'error' });
          setTimeout(() => {
            setNotification({ message: null, type: '' });
          }, 5000);
        });
    }
  };

  const filteredPersons = Array.isArray(persons) 
  ? persons.filter(person => 
      person.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} deletePerson={deletePerson}/> 
    </div>
  );
};

export default App;