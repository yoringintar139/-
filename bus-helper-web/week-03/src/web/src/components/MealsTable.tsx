import { Meal } from '../lib/api'
import { formatDate } from '../lib/utils'

interface Props {
  meals: Meal[]
}

export default function MealsTable({ meals }: Props) {
  if (meals.length === 0) return <p>조회된 급식 정보가 없습니다</p>

  return (
    <div>
      {meals.map((meal) => (
        <section key={meal.date}>
          <h2>{formatDate(meal.date)}</h2>
          <ul>
            {meal.menu_items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          {meal.calories && <p>칼로리: {meal.calories}</p>}
        </section>
      ))}
    </div>
  )
}
