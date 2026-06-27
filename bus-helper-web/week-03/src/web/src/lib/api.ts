export interface School {
  school_name: string
  school_code: string
  edu_office_code: string
  address: string
}

export interface Meal {
  date: string
  menu_items: string[]
  calories: string
}

export async function searchSchools(q: string): Promise<School[]> {
  const res = await fetch(`/api/schools?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error('학교 검색에 실패했습니다')
  const data = await res.json()
  return data.schools
}

export async function getMeals(
  edu_office_code: string,
  school_code: string,
  from_date: string,
  to_date: string,
): Promise<Meal[]> {
  const params = new URLSearchParams({ edu_office_code, school_code, from_date, to_date })
  const res = await fetch(`/api/meals?${params}`)
  if (!res.ok) throw new Error('급식 정보를 불러오는데 실패했습니다')
  const data = await res.json()
  return data.meals
}
