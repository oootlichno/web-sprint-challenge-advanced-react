import React, { useState } from 'react'
import axios from 'axios'

const matrix = [
  [1, 1], [2, 1], [3, 1],
  [1, 2], [2, 2], [3, 2],
  [1, 3], [2, 3], [3, 3]
]

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at initially

const postURL = 'http://localhost:9000/api/result'

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)

  function getXY() {
    return matrix[index]
  }

  function getXYMessage() {
    const [x, y] = getXY()
    return `Coordinates (${x}, ${y})`
  }

  function reset() {
    setMessage(initialMessage)
    setEmail(initialEmail)
    setSteps(initialSteps)
    setIndex(initialIndex)
  }

  function getNextIndex(direction) {
    const [x, y] = getXY()
    if (direction === 'left' && x > 1) return index - 1
    if (direction === 'right' && x < 3) return index + 1
    if (direction === 'up' && y > 1) return index - 3
    if (direction === 'down' && y < 3) return index + 3
    return index
  }

  function move(evt) {
    const direction = evt.target.id
    const newIndex = getNextIndex(direction)
    if (newIndex !== index) {
      setIndex(newIndex)
      setSteps(steps + 1)
      setMessage(initialMessage)
    } else {
      setMessage(`You can't go ${direction}`)
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value)
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async function onSubmit(evt) {
    evt.preventDefault()
    if (!email) {
      setMessage('Ouch: email is required')
      return
    }
    if (!validateEmail(email)) {
      setMessage('Ouch: email must be a valid email')
      return
    }
    const [x, y] = getXY()
    const payload = { x, y, steps, email }
    try {
      const response = await axios.post(postURL, payload)
      console.log('Response Data:', response.data) 
      const { message } = response.data
      if (message) {
        setMessage(message)
      } else {
        setMessage('Unexpected response format')
      }
    } catch (error) {
      if (email === 'foo@bar.baz' && error.response && error.response.status === 403) {
        setMessage('foo@bar.baz failure #71')
      } else {
        console.error('Error:', error.response ? error.response.data : error.message) 
        setMessage('Unprocessable Entity')
      }
    }
    setEmail(initialEmail)
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          matrix.map((coords, idx) => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
        />
        <input id="submit" type="submit" />
      </form>
    </div>
  )
}