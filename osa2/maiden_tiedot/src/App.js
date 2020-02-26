import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios'

const COUNTRY_RESOURCE = 'https://restcountries.eu/rest/v2/all';
const WEATHER_RESOURCE = 'https://api.openweathermap.org/data/2.5/weather?units=metric'
const WEATHER_RESOURCE_CITY_PARAM = 'q'
const WEATHER_RESOURCE_APPID_PARAM = 'appid'
const WEATHER_ICON_RESOURCE = 'http://openweathermap.org/img/wn/{icon}@2x.png'


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
    <Weather country={country}/>
  </>
)

const Weather = ({country}) => {

  const [weather, setWeather] = useState(undefined)
  const [iconUrl, setIconUrl] = useState('')
  const weatherUrl = new URL(WEATHER_RESOURCE);
  weatherUrl.searchParams.append(WEATHER_RESOURCE_CITY_PARAM, country.capital);
  const API_KEY = process.env.REACT_APP_API_KEY
  console.log(process.env)
  weatherUrl.searchParams.append(WEATHER_RESOURCE_APPID_PARAM, API_KEY)

  useEffect(() => {
    console.log("requesting")
    axios
      .get(weatherUrl)
      .then(response => {
        const icon = response.data.weather[0].icon
        const url = WEATHER_ICON_RESOURCE.replace("{icon}", icon)
        setWeather(response.data)
        setIconUrl(url)
      })
    }, [weatherUrl])
  if (weather) {
    return (
      <>
        <h2>Weather in {country.capital}</h2>
        <p><b>temperature:</b> {weather.main.temp} Celsius</p>
        <img src={iconUrl} alt='' />
        <p><b>wind:</b> {weather.wind.speed} direction {weather.wind.deg} degrees</p>
      </>
    )
  } else {
    return(<></>)
  }
}

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
