import { Group } from "@/domain/group";
import { Context, useWithContext } from "best-behavior";
import { browserContext, BrowserTestInstrument } from "best-behavior/browser";
import { DisplayElementList, TestDisplay } from "../../helpers/displays/display";
import { DisplayableGroupSet } from "@/app/courses/[courseId]/groups/components/DisplayableGroupSet";
import { GroupDisplayElement } from "../../helpers/displays/groupDisplayElement";
import { GroupSet, GroupSetId } from "@/domain/groupSet";

const useBrowser = useWithContext({
  browser: browserContext()
})

export const testableGroupList: Context<TestableGroupList> = useBrowser({
  init({ browser }) {
    return new TestableGroupList(browser)
  },
})

class TestableGroupList {
  private groups: Array<Group> = []
  private groupSets: Array<GroupSet> = []

  constructor(private browser: BrowserTestInstrument) { }

  withGroups(groups: Array<Group>) {
    this.groups = groups
    return this
  }

  withGroupSets(groupSets: Array<GroupSet>) {
    this.groupSets = groupSets
    return this
  }

  async render(groupSetId?: GroupSetId): Promise<void> {
    await this.browser.page.evaluate(async (data) => {
      function deserializeTestGroup(data: any): Group {
        return {
          members: new Set(data.members)
        }
      }

      const { render } = await import("./render/renderGroupList")
      render(data.groupSetId, data.groups.map(deserializeTestGroup), data.groupSets)
    }, {
      groupSetId,
      groups: this.groups.map(serializeTestGroup),
      groupSets: this.groupSets.map(serializeTestGroupSet)
    })
  }

  get display(): GroupListDisplay {
    return new GroupListDisplay(this.browser.page, { timeout: 200 })
  }
}

export function serializeTestGroup(group: Group): any {
  return {
    members: Array.from(group.members)
  }
}

export function serializeTestGroupSet(groupSet: GroupSet): DisplayableGroupSet {
  return {
    id: groupSet.id,
    name: groupSet.name,
    courseId: groupSet.courseId,
    groups: groupSet.groups.map(serializeTestGroup),
    createdAt: groupSet.createdAt.toISO() ?? ""
  }
}

class GroupListDisplay extends TestDisplay {
  get groups(): DisplayElementList {
    return this.selectAll("[data-student-group]")
  }

  group(index: number): GroupDisplayElement {
    return new GroupDisplayElement(this.page.locator("[data-student-group]").nth(index), this.options)
  }
}