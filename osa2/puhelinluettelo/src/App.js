import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Filter from './components/filter'
import PersonForm from './components/personForm'
import Persons from './components/persons'

const nameAlreadyExists = (persons, name) => {
  return persons.map(p=>p.name).includes(name)
}

const App = () => {

  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
    }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const handleAddPerson = (event) => {
    event.preventDefault()
    if (nameAlreadyExists(persons, newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const newPerson = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onFilterChange={handleFilterChange}/>

      <h2>add a new</h2>
      <PersonForm
        handleAddPerson={handleAddPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter}/>

    </div>
  )

}

export default App
