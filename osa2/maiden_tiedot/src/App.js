import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'

const COUNTRY_RESOURCE = 'https://restcountries.eu/rest/v2/all';

const Filter = ({filter, handleFilterChanged}) => {
  return (
    <p>filter shown with <input value={filter} onChange={handleFilterChanged}/></p>
  )
}

const MainView = ({countries}) => {
  if (countries.length === 1) {
    return ( <CountryDetails country={countries[0]}/> )
  } else if ( 1 < countries.length && countries.length <= 10) {
    return (<CountryListing countries={countries}/>)
  } else if (countries.length > 10 ) {
    return ( <p>Too many matches, specify another filter</p> )
  } else {
    return (<></>)
  }
}

const CountryListing = ({countries}) => {
  return (
    <ul>
      {countries.map(country => <li key={country.name}>{country.name}</li>)}
    </ul>
  )
}

const CountryDetails = ({country}) => (
  <>
    <h1>{country.name}</h1>
    <p>capital {country.capital}<br/>
    population {country.population}</p>
    <h2>languages</h2>
      <ul>
        {country.languages.map(l => <li key={l.name}>{l.name}</li>)}
      </ul>
    <img src={country.flag} width="200" alt=""/>
  </>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const handleFilterChanged = (event) => (
    setFilter(event.target.value)
  )

  const countryNameFilter = (country) => (
    country.name.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    axios
      .get(COUNTRY_RESOURCE)
      .then(response => {
        setCountries(response.data)
      })
    }, [])


  return (
    <div>
      <Filter filter={filter} handleFilterChanged={handleFilterChanged} />
      <MainView countries={countries.filter(countryNameFilter)}/>
    </div>
  );
}

export default App;
