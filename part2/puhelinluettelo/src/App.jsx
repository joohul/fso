import { useState } from 'react'

// Show one person
const DisplayPerson = (props) => {
  const { person } = props
  return (
    <p>
      {person.name} {person.number}
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
  const { persons } = props
  return (
    <div>
      {persons.map(person => <DisplayPerson key={person.name} person={person} />)}
    </div>
   )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    // Check if the name already exists in the phonebook
    // Number doesn't need to be checked per the excercise (?)
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
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
      <h2>Add new person</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <SearchForm newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <DisplayPersons persons={persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))} />
    </div>
  )

}

export default App