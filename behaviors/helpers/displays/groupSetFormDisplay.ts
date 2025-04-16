import { DisplayElement, DisplayElementList } from "./display"
import { GroupDisplayElement } from "./groupDisplayElement"

export class GroupSetFormElement extends DisplayElement {
  async waitForGroups(count: number): Promise<void> {
    await this.selectAllDescendants(`[data-student-group]`)
      .atIndex(count - 1)
      .waitForVisible()
  }

  get recordGroupsButton(): DisplayElement {
    return this.selectDescendant("[data-record-groups-button]")
  }

  get cancelButton(): DisplayElement {
    return this.selectDescendant("[data-cancel-button]")
  }

  get groupSetNameInput(): DisplayElement {
    return this.selectDescendant("[data-group-set-name-input]")
  }

  get groups(): DisplayElementList {
    return this.selectAllDescendants("[data-student-group]")
  }

  get inputError(): DisplayElement {
    return this.selectDescendant("[data-input-error]")
  }

  group(index: number): GroupDisplayElement {
    return new GroupDisplayElement(
      this.locator.locator("[data-student-group]").nth(index),
      this.options,
    )
  }
}
