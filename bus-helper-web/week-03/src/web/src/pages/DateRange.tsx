import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toYYYYMMDD } from '../lib/utils'

export default function DateRange() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const school = state?.school

  const today = new Date()
  const [fromDate, setFromDate] = useState(toYYYYMMDD(today))
  const [toDate, setToDate] = useState(toYYYYMMDD(today))

  if (!school) {
    navigate('/')
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/meals', { state: { school, fromDate, toDate } })
  }

  return (
    <main>
      <h1>{school.school_name} 급식 조회</h1>
      <form onSubmit={handleSubmit}>
        <label>
          시작일
          <input type="date" value={fromDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}
            onChange={(e) => setFromDate(e.target.value.replace(/-/g, ''))} required />
        </label>
        <label>
          종료일
          <input type="date" value={toDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}
            onChange={(e) => setToDate(e.target.value.replace(/-/g, ''))} required />
        </label>
        <button type="submit">급식 조회</button>
      </form>
      <button onClick={() => navigate('/')}>← 학교 다시 선택</button>
    </main>
  )
}
