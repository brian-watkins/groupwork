import { DisplayElement } from "./display"

export class GroupMemberDisplayElement extends DisplayElement {
  get partneredIndicator(): DisplayElement {
    return this.selectDescendant("[data-partnered-indicator]")
  }
}
