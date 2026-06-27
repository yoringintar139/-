import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchSchools, School } from '../lib/api'

export default function Landing() {
  const [query, setQuery] = useState('')
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const results = await searchSchools(query)
      setSchools(results)
      if (results.length === 0) setError('검색 결과가 없습니다')
    } catch {
      setError('학교 검색에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (school: School) => {
    navigate('/date-range', { state: { school } })
  }

  return (
    <main>
      <h1>급식 정보 조회</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="학교 이름을 입력하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? '검색 중...' : '검색'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      <ul>
        {schools.map((school) => (
          <li key={school.school_code}>
            <button onClick={() => handleSelect(school)}>
              {school.school_name} ({school.address})
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
