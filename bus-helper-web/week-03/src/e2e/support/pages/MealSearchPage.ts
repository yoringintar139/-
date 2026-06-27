import { Page } from '@playwright/test'

export class MealSearchPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  async searchSchool(name: string) {
    await this.page.fill('input[placeholder="학교 이름을 입력하세요"]', name)
    await this.page.click('button[type="submit"]')
  }

  async selectFirstSchool() {
    await this.page.click('ul li:first-child button')
  }

  async submitDateRange() {
    await this.page.click('button[type="submit"]')
  }
}
