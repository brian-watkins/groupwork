import { Group } from "@/domain/group";
import { Context, useWithContext } from "best-behavior";
import { browserContext, BrowserTestInstrument } from "best-behavior/browser";
import { TestDisplay } from "../../app/helpers/display";

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

  constructor(private browser: BrowserTestInstrument) { }

  withGroups(groups: Array<Group>) {
    this.groups = groups
    return this
  }

  async render(): Promise<void> {
    this.browser.page.evaluate(async (data) => {
      function deserializeTestGroup(data: any): Group {
        return {
          members: new Set(data.members)
        }
      }

      const { render } = await import("./render/renderGroupList")
      render(data.groups.map(deserializeTestGroup))
    }, { groups: this.groups.map(serializeTestGroup) })
  }

  get display(): TestDisplay {
    return new TestDisplay(this.browser.page, { timeout: 200 })
  }
}

export function serializeTestGroup(group: Group): any {
  return {
    members: Array.from(group.members)
  }
}