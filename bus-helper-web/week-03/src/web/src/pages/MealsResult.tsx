import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getMeals, Meal } from '../lib/api'
import { formatDate } from '../lib/utils'

export default function MealsResult() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!state?.school) { navigate('/'); return }
    getMeals(state.school.edu_office_code, state.school.school_code, state.fromDate, state.toDate)
      .then(setMeals)
      .catch(() => setError('급식 정보를 불러오는데 실패했습니다'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>불러오는 중...</p>

  return (
    <main>
      <h1>{state?.school?.school_name} 급식 메뉴</h1>
      {error && <p role="alert">{error}</p>}
      {meals.length === 0 && !error && <p>조회된 급식 정보가 없습니다</p>}
      {meals.map((meal) => (
        <section key={meal.date}>
          <h2>{formatDate(meal.date)}</h2>
          <ul>
            {meal.menu_items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          {meal.calories && <p>칼로리: {meal.calories}</p>}
        </section>
      ))}
      <button onClick={() => navigate(-1)}>← 날짜 다시 선택</button>
    </main>
  )
}
