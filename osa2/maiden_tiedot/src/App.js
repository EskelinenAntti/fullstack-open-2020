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

const MainView = ({countries, onCountrySelected}) => {
  if (countries.length === 1) {
    return ( <CountryDetails country={countries[0]}/> )
  } else if ( 1 < countries.length && countries.length <= 10) {
    return ( <CountryListing
              countries={countries}
              onCountrySelected={onCountrySelected}/>
    )
  } else if (countries.length > 10 ) {
    return ( <p>Too many matches, specify another filter</p> )
  } else {
    return (<></>)
  }
}

const CountryListing = ({countries, onCountrySelected}) => {
  return (
    <ul>
      {countries.map(country =>
        <CountryListingItem
          key={country.name}
          country={country}
          onCountrySelected={onCountrySelected}
        />)}
    </ul>
  )
}

const CountryListingItem = ({country, onCountrySelected}) => {
  const createClickHandler = (country) => {
    return () => onCountrySelected(country)
  }
  return (
    <li>
      {country.name}
      <button onClick={createClickHandler(country)}>show</button>
    </li>
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

  const onCountrySelected = (country) => (
    setFilter(country.name)
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
      <MainView
        countries={countries.filter(countryNameFilter)}
        onCountrySelected={onCountrySelected}/>
    </div>
  );
}

export default App;
