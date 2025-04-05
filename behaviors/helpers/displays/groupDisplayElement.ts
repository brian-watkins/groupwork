import { DisplayElement, DisplayElementList } from "./display";
import { GroupMemberDisplayElement } from "./groupMemberDisplayElement";

export class GroupDisplayElement extends DisplayElement {
  get members(): DisplayElementList {
    return this.selectAllDescendants("[data-group-member]")
  }

  member(index: number): GroupMemberDisplayElement {
    return new GroupMemberDisplayElement(this.locator.locator("[data-group-member]").nth(index), this.options)
  }
}
