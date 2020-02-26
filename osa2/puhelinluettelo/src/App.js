import React, { useState } from 'react'

const Number = ({person}) => (
  <li>{person.name} {person.number}</li>
)

const nameAlreadyExists = (persons, name) => {
  return persons.map(p=>p.name).includes(name)
}

const Filter = ({filter, onFilterChange}) => {
  return (
    <p>filter shown with <input value={filter} onChange={onFilterChange}/></p>
  )
}

const PersonForm = (props) => (

  <form onSubmit={props.handleAddPerson}>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({persons, filter}) => {
  const caseinsensitiveFilter = (person) => (
    person.name.toUpperCase().includes(
      filter.toUpperCase()
    )
  )
  return (
    <ul>
      {persons
        .filter(caseinsensitiveFilter)
        .map(person => <Number key={person.name} person={person}/>)}
    </ul>
  )
}

const App = () => {

  const [ persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: '+358 23 456 7890'
    },
    {
      name: 'Antti Eskelinen',
      number: '123445'
    }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')


  const [ filter, setFilter ] = useState('')

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
