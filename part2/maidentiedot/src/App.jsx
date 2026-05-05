import { useState, useEffect } from 'react'

const SearchForm = (props) => {
  const { newSearch, handleSearchChange } = props
  return (
    <div>
      find countries: <input value={newSearch} onChange={handleSearchChange} />
    </div>
   )
}

// Show details of a country by setting the search term to the country's name
// Names matching multiple countries don't work but this is OK per the exercise instructions
const DetailsButton = (props) => {
  const { country, setNewSearch } = props
  return (
    <button onClick={() => setNewSearch(country.name.common)}>show</button>
  )
}

// Display the name of a country
const DisplayCountryName = (props) => {
  const { country, setNewSearch } = props
  return (
    <p>
      {country.name.common} <DetailsButton country={country} setNewSearch={setNewSearch} />
    </p>
   )
}

// Display details of a country
const DisplayCountryDetails = (props) => {
  const { country } = props
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <h3>Languages:</h3>
      {Object.values(country.languages).map(language => <p key={language}>{language}</p>)}
      <img src={country.flags.png}/>
    </div>
  )
}

// Display countries matching the search term
const DisplayCountries = (props) => {
  const { countries, setNewSearch } = props
  if (countries.length > 10) { // Too many
    return <p>Too many matches, specify another filter</p>
  }
  else if (countries.length === 1) { // Show details if only one match
    return <DisplayCountryDetails country={countries[0]} />
  }
  return ( // Show list
    <div>
      {countries.map(country => (
        <DisplayCountryName key={country.name.common} country={country} setNewSearch={setNewSearch} />
      ))}
    </div>
   )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const apiUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

  useEffect(() => {
    fetch(`${apiUrl}all`)
      .then(response => response.json())
      .then(data => setCountries(data))
  }, [])

  const [newSearch, setNewSearch] = useState('')

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <SearchForm newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <DisplayCountries countries={countries.filter(country => country.name.common.toLowerCase().includes(newSearch.toLowerCase()))} setNewSearch={setNewSearch} />
    </div>
  )
}

export default App