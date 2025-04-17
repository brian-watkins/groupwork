import { Group } from "@/domain/group"
import { Context, use } from "best-behavior"
import { browserContext, BrowserTestInstrument } from "best-behavior/browser"
import {
  DisplayElement,
  DisplayElementList,
  TestDisplay,
} from "../../helpers/displays/display"
import { DisplayableGroupSet } from "@/app/courses/[courseId]/groups/components/DisplayableGroupSet"
import { GroupDisplayElement } from "../../helpers/displays/groupDisplayElement"
import { GroupSet, GroupSetId } from "@/domain/groupSet"

export const testableGroupList: Context<TestableGroupList> = use(
  browserContext(),
  {
    init(browser) {
      return new TestableGroupList(browser)
    },
  },
)

class TestableGroupList {
  private groups: Array<Group> = []
  private groupSets: Array<GroupSet> = []
  private editable: boolean = true

  constructor(private browser: BrowserTestInstrument) {}

  withGroups(groups: Array<Group>) {
    this.groups = groups
    return this
  }

  withGroupSets(groupSets: Array<GroupSet>) {
    this.groupSets = groupSets
    return this
  }

  setEditable(editable: boolean) {
    this.editable = editable
    return this
  }

  async render(groupSetId?: GroupSetId): Promise<void> {
    await this.browser.page.evaluate(
      async (data) => {
        function deserializeTestGroup(data: any): Group {
          return {
            members: new Set(data.members),
          }
        }

        const { render } = await import("./render/groups/renderGroupList")
        render(
          data.groupSetId,
          data.groups.map(deserializeTestGroup),
          data.groupSets,
          data.editable,
        )
      },
      {
        groupSetId,
        groups: this.groups.map(serializeTestGroup),
        groupSets: this.groupSets.map(serializeTestGroupSet),
        editable: this.editable,
      },
    )
  }

  get display(): GroupListDisplay {
    return new GroupListDisplay(this.browser.page, { timeout: 200 })
  }
}

export function serializeTestGroup(group: Group): any {
  return {
    members: Array.from(group.members),
  }
}

export function serializeTestGroupSet(groupSet: GroupSet): DisplayableGroupSet {
  return {
    id: groupSet.id,
    name: groupSet.name,
    courseId: groupSet.courseId,
    groups: groupSet.groups.map(serializeTestGroup),
    createdAt: groupSet.createdAt.toISO() ?? "",
  }
}

class GroupListDisplay extends TestDisplay {
  get groups(): DisplayElementList {
    return this.selectAll("[data-student-group]")
  }

  group(index: number): GroupDisplayElement {
    return new GroupDisplayElement(
      this.page.locator("[data-student-group]").nth(index),
      this.options,
    )
  }

  get previousCollaborators(): DisplayElement {
    return this.select("[data-previous-collaborators]")
  }
}
