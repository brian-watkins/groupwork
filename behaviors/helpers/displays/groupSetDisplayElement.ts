import { DisplayElement, DisplayElementList } from "./display"
import { GroupDisplayElement } from "./groupDisplayElement"

export class GroupSetDisplayElement extends DisplayElement {
  get name(): DisplayElement {
    return this.selectDescendant("[data-group-set-name]")
  }

  get createdAt(): DisplayElement {
    return this.selectDescendant("[data-group-set-created-at]")
  }

  get editButton(): DisplayElement {
    return this.selectDescendant("[data-edit-group-set-button]")
  }

  get deleteButton(): DisplayElement {
    return this.selectDescendant("[data-delete-group-set-button]")
  }

  get groups(): DisplayElementList {
    return this.selectAllDescendants("[data-student-group]")
  }

  group(index: number): GroupDisplayElement {
    return new GroupDisplayElement(this.locator.locator("[data-student-group]").nth(index), this.options)
  }

  get members(): DisplayElementList {
    return this.selectAllDescendants("[data-group-member]")
  }
}