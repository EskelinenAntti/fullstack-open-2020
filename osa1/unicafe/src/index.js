import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Button = ({text, handleClick}) => (
  <button onClick={handleClick}>{text}</button>
)

const StatisticsLine = ({text, value}) => (
  <tr><td>{text}</td><td>{value}</td></tr>
)

const AverageFeedback = ({good, bad, feedbackCount}) => {
  const average = ( (good * 1) + (bad * -1) ) / feedbackCount

  return (<tr><td>average</td><td>{average}</td></tr>)
}

const PositiveFeedback = ({good, feedbackCount}) => {
  const positivePercent = (good / feedbackCount) * 100

  return ( <tr><td>positive</td><td> {positivePercent} %</td></tr>)
}

const Statistics = ({good, neutral, bad}) => {
  const feedbackCount = good + neutral + bad

  if (feedbackCount === 0) {
    return <p>No feedback given</p>
  }

  return (
    <table>
      <tbody>
      <StatisticsLine text="good" value={good}/>
      <StatisticsLine text="neutral" value={neutral}/>
      <StatisticsLine text="bad" value={bad}/>
      <AverageFeedback good={good} neutral={neutral} bad={bad} feedbackCount={feedbackCount}/>
      <PositiveFeedback good={good} feedbackCount={feedbackCount}/>
      </tbody>
    </table>
  )
}


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" handleClick={() => setGood(good+1)}/>
      <Button text="neutral" handleClick={() => setNeutral(neutral+1)}/>
      <Button text="bad" handleClick={() => setBad(bad+1)}/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)