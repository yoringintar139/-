import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Landing from '../../pages/Landing'

describe('App integration', () => {
  it('renders landing page', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    )
    expect(screen.getByText('급식 정보 조회')).toBeInTheDocument()
  })

  it('shows school search input', () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText('학교 이름을 입력하세요')).toBeInTheDocument()
  })
})
