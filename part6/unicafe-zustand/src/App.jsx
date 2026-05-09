import Buttons from './components/Buttons'
import Statistics from './components/Statistics'
import { create } from 'zustand'

const useFeedbackStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  addGood: () => set((state) => ({ good: state.good + 1 })),
  addNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
  addBad: () => set((state) => ({ bad: state.bad + 1 })),
}))

const App = () => {
  const good = useFeedbackStore((state) => state.good)
  const neutral = useFeedbackStore((state) => state.neutral)
  const bad = useFeedbackStore((state) => state.bad)
  const addGood = useFeedbackStore((state) => state.addGood)
  const addNeutral = useFeedbackStore((state) => state.addNeutral)
  const addBad = useFeedbackStore((state) => state.addBad)

  return (
    <>
      <h1>Unicafe</h1>
      <Buttons
        addGood={addGood}
        addNeutral={addNeutral}
        addBad={addBad}
      />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App
