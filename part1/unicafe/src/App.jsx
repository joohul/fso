import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
const Display = (props) => {
  return (
    <div>
      {props.text} {props.value}
    </div>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const { good, neutral, bad } = props
  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={good+neutral+bad} />
          <StatisticLine text="average" value={(good-bad) / (good+neutral+bad)} />
          <StatisticLine text="positive (%)" value={good / (good+neutral+bad) * 100} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setValue = (val, state) => () => {
    console.log(val, state)
    state(val)
  }

  return (
    <div>
      <h1> Feedback </h1>
      <Button text="good" handleClick={setValue(good+1, setGood)} />
      <Button text="neutral" handleClick={setValue(neutral+1, setNeutral)} />
      <Button text="bad" handleClick={setValue(bad+1, setBad)} />
      <h1> Stats </h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App