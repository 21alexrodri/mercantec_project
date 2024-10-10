import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './components/home/home'
import './App.css'
import Header from './components/header/header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />
    <Home />
    </>
  )
}

export default App
