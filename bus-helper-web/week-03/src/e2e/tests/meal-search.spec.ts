import { test, expect } from '@playwright/test'
import { MealSearchPage } from '../support/pages/MealSearchPage'
import schools from '../fixtures/schools.json'
import meals from '../fixtures/meals.json'

test.describe('급식 정보 조회', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/schools*', (route) => route.fulfill({ json: schools }))
    await page.route('/api/meals*', (route) => route.fulfill({ json: meals }))
    await page.route('/api/health', (route) => route.fulfill({ json: { status: 'ok' } }))
  })

  test('학교 검색 후 급식 조회 happy path', async ({ page }) => {
    const searchPage = new MealSearchPage(page)
    await searchPage.goto()
    await searchPage.searchSchool('테스트')
    await expect(page.locator('ul li')).toHaveCount(1)
    await searchPage.selectFirstSchool()
    await searchPage.submitDateRange()
    await expect(page.locator('h2')).toBeVisible()
  })

  test('검색 결과 없음', async ({ page }) => {
    await page.route('/api/schools*', (route) => route.fulfill({ json: { schools: [] } }))
    const searchPage = new MealSearchPage(page)
    await searchPage.goto()
    await searchPage.searchSchool('존재하지않는학교')
    await expect(page.getByRole('alert')).toContainText('검색 결과가 없습니다')
  })

  test('페이지 타이틀 확인', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('급식 정보 조회')
  })
})
