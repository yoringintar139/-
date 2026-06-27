import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const schoolsResponse = {
  schools: [
    { school_name: '테스트초등학교', school_code: '7010057', edu_office_code: 'B10', address: '서울특별시 종로구' },
  ],
}

const mealsResponse = {
  meals: [
    { date: '20240101', menu_items: ['밥', '된장국', '김치'], calories: '650 Kcal' },
    { date: '20240102', menu_items: ['볶음밥', '미역국', '깍두기'], calories: '700 Kcal' },
  ],
}

export const handlers = [
  http.get('/api/schools', () => HttpResponse.json(schoolsResponse)),
  http.get('/api/meals', () => HttpResponse.json(mealsResponse)),
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),
]

export const server = setupServer(...handlers)
