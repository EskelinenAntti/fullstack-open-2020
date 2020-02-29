import React, { useState, useEffect } from 'react'

import Filter from './components/filter'
import PersonForm from './components/personForm'
import Persons from './components/persons'

import personService from './services/persons'

const nameAlreadyExists = (persons, name) => {
  return persons.filter(person => person.name === name).length > 0
}

const Notification = ({ message }) => {

  if (message === null) {
    return null
  }

  const style = {
    "color": message.isError ? "red" : "green",
    "background": "lightgrey",
    "fontSize": "20px",
    "borderStyle": "solid",
    "borderRadius": "5px",
    "padding": "10px",
    "marginBottom": "10px"
  }

  return (
    <div style={style}>
      {message.content}
    </div>
  )
}

const App = () => {

  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')

  const [ message, setMessage ] = useState(null)

  // This would be more elegant if we could use optional chaining here.
  const content = message === null ? null : message.content
  const isError = message === null ? null : message.isError

  useEffect(() => {
    personService
      .getAll()
      .then(allPersons =>
        setPersons(allPersons)
        )
    }, [])

  // Start the timer in effect hook to avoid memory leaks.
  useEffect(() => {
    const clearMessage = () => setMessage(null)
    const timer = setTimeout(clearMessage, 5000)

    return () => clearInterval(timer)
  }, [content, isError])
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const handleUpdate = (name) => {
    const oldPerson = persons.find(p => p.name === name)
    const updatedPerson = {...oldPerson, number: newNumber}

    personService
      .update(updatedPerson.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(
          persons.map(
            person =>
              person.id !== oldPerson.id ? person: returnedPerson
            )
          )
        setMessage({content:`Updated ${updatedPerson.name}.`, isError: false})
        })
      .catch(_ => {
        setMessage({content: `Information of ${name} has already been removed from server`, isError: true})
      })
  }

  const handleCreate = () => {
    const newPerson = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPerson)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setMessage({content: `Created ${newPerson.name}.`, isError: false})
      })

    setNewName('')
    setNewNumber('')
  }

  const handleDelete = deletedPerson => {
    const accepted = window.confirm(`Delete ${deletedPerson.name}?`)
    if (accepted) {
      personService
        .remove(deletedPerson.id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
          setMessage({content: `Deleted ${deletedPerson.name}.`, isError:false})
        })
    }
  }

  const handleAddPerson = (event) => {
    event.preventDefault()

    if (nameAlreadyExists(persons, newName)) {
      const acceptModification = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
        )

      if (acceptModification) {
        handleUpdate(newName)
      }
    } else {
      handleCreate()
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
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
      <Persons persons={persons} filter={filter} onDelete={handleDelete}/>

    </div>
  )

}

export default App
