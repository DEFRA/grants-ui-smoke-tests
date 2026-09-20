export class GeospatialField {
  constructor(page, id) {
    this.page = page
    this.id = id
  }

  // The map widget's JS permanently hides this textarea (adds a `js-hidden`
  // class) once it enhances the field, so it can never be filled via the
  // normal visible-element interaction. Its value is still submitted as-is,
  // so set it directly rather than driving the map UI.
  async fill(value) {
    const textarea = this.page.locator(`textarea#${this.id}`)
    await textarea.evaluate((el, val) => {
      el.value = val
    }, value)
  }
}
