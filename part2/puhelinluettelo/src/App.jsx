import { useState, useEffect } from 'react'
import personService from './services/persons'
import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'

// Delete person -button
const DeleteButton = (props) => {
  const { person, deletePerson } = props
  return (
    <button onClick={() => deletePerson(person)}>delete</button>
  )
}

// Show one person
const DisplayPerson = (props) => {
  const { person, deletePerson } = props
  return (
    <p>
      {person.name} {person.number} <DeleteButton person={person} deletePerson={deletePerson} />
    </p>
  )
}

// Add a new person to the phonebook
const PersonForm = (props) => {
  const { addPerson, newName, handleNameChange, newNumber, handleNumberChange } = props
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
   )
}

// Search for a person in the phonebook
const SearchForm = (props) => {
  const { newSearch, handleSearchChange } = props
  return (
    <div>
      search: <input value={newSearch} onChange={handleSearchChange} />
    </div>
   )
}

// Display multiple persons
const DisplayPersons = (props) => {
  const { persons, deletePerson } = props
  return (
    <div>
      {persons.map(person => <DisplayPerson key={person.name} person={person} deletePerson={deletePerson} />)}
    </div>
   )
}

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const addPerson = (event) => {
    event.preventDefault()
    // Check if the name already exists in the phonebook
    if (persons.some(person => person.name === newName)) {
      // If the name exists, ask to replace the number
      const person = persons.find(person => person.name === newName)
      if (window.confirm(`${person.name} is already in the phonebook, replace the current number?`)) {
        personService
          .update(person.id, { ...person, number: newNumber })
          .then(response => {
            setPersons(persons.filter(p => p.id !== person.id).concat(response.data)) // Update the state with the updated person
            setNewName('')
            setNewNumber('')
            showSuccess(`Updated ${person.name}'s number`)
          })
          .catch(error => {
            showError(`Error updating ${person.name}: ${error.response.data.error}`)
            setPersons(persons.filter(p => p.id !== person.id)) // Remove the person from the state if it has been deleted from the server
          })
      }
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        showSuccess(`Added ${newName}`)
      })
      .catch(error => {
        showError(`Error adding ${newName}: ${error.response.data.error}`)
      })
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(person.id)
        .then(response => {
          setPersons(persons.filter(p => p.id !== person.id)) // Remove the deleted person from the state
          showSuccess(`Deleted ${person.name}`)
        })
        .catch(error => {
          showError(`Error deleting ${person.name}: ${error.response.data.error}`)
        })
    }
  }

  // Separate functions for showing success/error messages to avoid repetition
  const showError = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  } 

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <h2>Add new person</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <SearchForm newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <DisplayPersons persons={persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))} deletePerson={deletePerson} />
    </div>
  )

}

export default App