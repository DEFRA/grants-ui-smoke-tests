export class MonthYearField {
  constructor(page, id) {
    this.page = page
    this.id = id
  }

  async set(month, year) {
    await this.page.locator(`input#${this.id}__month`).fill(month)
    await this.page.locator(`input#${this.id}__year`).fill(year)
  }
}
