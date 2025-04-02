import { DisplayElement, DisplayElementList } from "./display";

export class GroupDisplayElement extends DisplayElement {
  get members(): DisplayElementList {
    return this.selectAllDescendants("[data-group-member]")
  }
}
