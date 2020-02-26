import React from 'react'

const Number = ({person}) => (
    <li>{person.name} {person.number}</li>
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

export default Persons
