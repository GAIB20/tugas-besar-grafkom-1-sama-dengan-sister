import { useState } from 'react'
import './App.css'
import Head from './section/Head'
import Tool from './section/Tool'
import Properties from './section/Properties'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Head/>
      <div className='workspace'>
        <Tool/>
        <canvas></canvas>
        <Properties/>
      </div>
    </>
  )
}

export default App
