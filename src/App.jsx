import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChessBoard from './components/ChessBoard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <ChessBoard />
    </div>
  )
}

export default App
