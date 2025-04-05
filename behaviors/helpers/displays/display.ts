import { Locator, Page } from "playwright"

export interface TestDisplayOptions {
  timeout?: number
}

export class TestDisplay {
  constructor(protected page: Page, protected options: TestDisplayOptions) { }

  async pause(millis?: number): Promise<void> {
    if (millis === undefined) {
      return this.page.pause()
    } else {
      await new Promise(resolve => setTimeout(resolve, millis))
    }
  }

  select(selector: string): DisplayElement {
    return new DisplayElement(this.page.locator(selector), this.options)
  }

  selectWithText(text: string): DisplayElement {
    return new DisplayElement(this.page.getByText(text), this.options)
  }

  selectAll(selector: string): DisplayElementList {
    return new DisplayElementList(this.page.locator(selector), this.options)
  }
}

export interface BoundingRect {
  x: number
  y: number
  width: number
  height: number
}

export interface TypingOptions {
  sequentially?: boolean
}

export class DisplayElement {
  constructor(public locator: Locator, protected options: TestDisplayOptions) { }

  async boundingRect(): Promise<BoundingRect> {
    const box = await this.locator.boundingBox()
    if (box === null) {
      return { x: -1, y: -1, width: -1, height: -1 }
    }
    return box
  }

  selectDescendant(selector: string): DisplayElement {
    return new DisplayElement(this.locator.locator(selector), this.options)
  }

  selectDescendantByText(text: string): DisplayElement {
    return new DisplayElement(this.locator.getByText(text), this.options)
  }

  selectAllDescendants(selector: string): DisplayElementList {
    return new DisplayElementList(this.locator.locator(selector), this.options)
  }

  async text(): Promise<string> {
    return this.locator.innerText({ timeout: this.options.timeout })
  }

  async click(): Promise<void> {
    await this.locator.click({ trial: true })
    await this.locator.click({ timeout: this.options.timeout })
  }

  async type(text: string, options: TypingOptions = {}): Promise<void> {
    if (options.sequentially === true) {
      await this.locator.pressSequentially(text, { timeout: this.options.timeout, delay: 10 })
    } else {
      await this.locator.fill(text, { timeout: this.options.timeout })
    }
  }

  async blur(): Promise<void> {
    await this.locator.blur({ timeout: this.options.timeout })
  }

  async clear(): Promise<void> {
    await this.locator.clear({ timeout: this.options.timeout })
  }

  isEnabled(): Promise<boolean> {
    return this.locator.isEnabled({ timeout: this.options.timeout })
  }

  async waitForVisible(): Promise<void> {
    await this.locator.waitFor({ state: "visible", timeout: this.options.timeout })
  }

  async isVisible(): Promise<boolean> {
    await this.locator.waitFor({ state: "visible", timeout: this.options.timeout })
    return true
  }

  async isHidden(): Promise<boolean> {
    await this.locator.waitFor({ state: "hidden", timeout: this.options.timeout })
    return true
  }

  async dragBy(deltaX: number, deltaY: number): Promise<void> {
    const box = await this.boundingRect()
    const startX = box.x + box.width / 2
    const startY = box.y + box.height / 2
    await this.locator.page().mouse.move(startX, startY)
    await this.locator.page().mouse.down()
    await this.locator.page().mouse.move(startX + deltaX, startY + deltaY)
    await this.locator.page().mouse.up()
  }

  async dragTo(element: DisplayElement): Promise<void> {
    const box = await this.boundingRect()
    const elementBox = await element.boundingRect()
    await this.locator.dragTo(element.locator, {
      force: true,
      sourcePosition: {
        x: box.width / 2,
        y: box.height / 2
      },
      targetPosition: {
        x: elementBox.width / 2,
        y: elementBox.height / 2
      },
      timeout: 2000
    })
  }

  async selectOption(option: string): Promise<void> {
    await this.locator.selectOption(option, { timeout: this.options.timeout })
  }

  async selectedOption(): Promise<string> {
    return await this.locator.inputValue({ timeout: this.options.timeout })
  }

  async inputValue(): Promise<string> {
    return await this.locator.inputValue({ timeout: this.options.timeout })
  }

  async attribute(name: string): Promise<string> {
    const value = await this.locator.getAttribute(name, { timeout: this.options.timeout })
    return value ?? ""
  }
}

export class DisplayElementList {
  constructor(protected locator: Locator, protected options: TestDisplayOptions) { }

  atIndex(index: number): DisplayElement {
    return new DisplayElement(this.locator.nth(index), this.options)
  }

  texts(): Promise<Array<string>> {
    return this.locator.allInnerTexts()
  }

  async isVisible(): Promise<boolean> {
    try {
      await this.locator.first().waitFor({ state: "visible", timeout: this.options.timeout })
      return true
    } catch {
      return false
    }
  }

  async count(): Promise<number> {
    await this.locator.first().waitFor({ state: "visible", timeout: this.options.timeout })
    return this.locator.count()
  }
}