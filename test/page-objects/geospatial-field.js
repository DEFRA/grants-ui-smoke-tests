export class GeospatialField {
  constructor(page, id) {
    this.page = page
    this.id = id
  }

  async fill(value) {
    const textarea = this.page.locator(`textarea#${this.id}`)
    await textarea.waitFor({ state: 'visible' })
    await textarea.fill(value)
  }
}
