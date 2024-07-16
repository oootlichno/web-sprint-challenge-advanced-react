
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AppFunctional from './AppFunctional'

let steps, message, user, x, y

describe('AppFunctional component', () => {
  beforeEach(() => {
    render(<AppFunctional />)
  })

  test('[1] Check for the button texts', async () => {
    expect(screen.getByText('LEFT')).toBeVisible()
    expect(screen.getByText('UP')).toBeVisible()
    expect(screen.getByText('RIGHT')).toBeVisible()
    expect(screen.getByText('DOWN')).toBeVisible()
    expect(screen.getByText('reset')).toBeVisible()
  })

  test('[2] Check for the email input', async () => {
    expect(screen.getByPlaceholderText('type email')).toBeInTheDocument()
  })

  test(`[3] Counter and steps working correctly`, async () => {
    const leftButton = screen.getByText('LEFT')
    const rightButton = screen.getByText('RIGHT')
    const downButton = screen.getByText('DOWN')
    const upButton = screen.getByText('UP')

    fireEvent.click(leftButton || rightButton || downButton || upButton)
    steps = 1
    x = 1  
    y = 2 
    
    await waitFor(() => {
      expect(screen.getByText(`Coordinates (${x}, ${y})`)).toBeVisible()
    })
  })
})

  
