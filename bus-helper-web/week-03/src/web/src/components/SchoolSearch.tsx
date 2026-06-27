import { useState } from 'react'
import { searchSchools, School } from '../lib/api'

interface Props {
  onSelect: (school: School) => void
}

export default function SchoolSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<School[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const schools = await searchSchools(query)
      setResults(schools)
      if (schools.length === 0) setError('검색 결과가 없습니다')
    } catch {
      setError('학교 검색에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
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
        {results.map((school) => (
          <li key={school.school_code}>
            <button onClick={() => onSelect(school)}>
              {school.school_name} ({school.address})
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
