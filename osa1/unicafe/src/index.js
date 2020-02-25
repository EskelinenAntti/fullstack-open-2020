import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Button = ({text, handleClick}) => (
  <button onClick={handleClick}>{text}</button>
)

const FeedbackStatistic = ({feedbackType, amount}) => (
  <p>{feedbackType} {amount}</p>
)

const AverageFeedback = ({good, neutral, bad}) => {
  const feedbackCount = good + neutral + bad
  const average = ( (good * 1) + (bad * -1) ) / feedbackCount

  return (<p>average {average}</p> )
}

const PositiveFeedback = ({good, neutral, bad}) => {
  const feedbackCount = good + neutral + bad
  const positivePercent = (good / feedbackCount) * 100

  return (<p>positive {positivePercent} %</p>)
}

const Statistics = ({good, neutral, bad}) => {
  return (
    <>
      <FeedbackStatistic feedbackType={"good"} amount={good}/>
      <FeedbackStatistic feedbackType={"neutral"} amount={neutral}/>
      <FeedbackStatistic feedbackType={"bad"} amount={bad}/>
      <AverageFeedback good={good} neutral={neutral} bad={bad}/>
      <PositiveFeedback good={good} neutral={neutral} bad={bad}/>
    </>
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
      <Button text={"good"} handleClick={() => setGood(good+1)}/>
      <Button text={"neutral"} handleClick={() => setNeutral(neutral+1)}/>
      <Button text={"bad"} handleClick={() => setBad(bad+1)}/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)