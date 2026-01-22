import { DisplayElement } from "./display"

export class GroupMemberDisplayElement extends DisplayElement {
  get partneredIndicator(): DisplayElement {
    return this.selectDescendant("[data-partnered-indicator]")
  }

  async startDrag(): Promise<void> {
    const box = await this.boundingRect()
    const position = {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    }
    await this.locator.page().mouse.move(position.x, position.y)
    await this.locator.page().mouse.down()
  }
}
