import { Group } from "@/domain/group";
import { Context, useWithContext } from "best-behavior";
import { browserContext, BrowserTestInstrument } from "best-behavior/browser";
import { GroupSetFormElement } from "../../helpers/displays/groupSetFormDisplay";

const useBrowser = useWithContext({
  browser: browserContext()
})

export const testableGroupSetForm: Context<TestableGroupSetForm> = useBrowser({
  init({ browser }) {
    return new TestableGroupSetForm(browser)
  },
})

class TestableGroupSetForm {
  private groups: Array<Group> = [];
  private isRecording: boolean = false;

  constructor(private browser: BrowserTestInstrument) { }

  withGroups(groups: Array<Group>) {
    this.groups = groups;
    return this;
  }

  withIsRecording(isRecording: boolean) {
    this.isRecording = isRecording;
    return this;
  }

  async render(): Promise<void> {
    await this.browser.page.evaluate(async (data) => {
      function deserializeTestGroup(data: any): Group {
        return {
          members: new Set(data.members)
        }
      }

      const { render } = await import("./render/renderGroupSetForm");
      
      // Create a function that will be called when record button is clicked
      // This will set a flag on window that we can check in our test
      window.recordedGroupSetName = null;
      const onRecordGroups = (name: string) => {
        window.recordedGroupSetName = name;
      };
      
      render(
        data.groups.map(deserializeTestGroup), 
        onRecordGroups,
        data.isRecording
      );
    }, { 
      groups: this.groups.map(serializeTestGroup),
      isRecording: this.isRecording
    });
  }

  async getRecordedGroupSetName(): Promise<string | null> {
    return this.browser.page.evaluate(() => {
      return window.recordedGroupSetName;
    });
  }

  get display(): GroupSetFormElement {
    return new GroupSetFormElement(this.browser.page.locator("[data-group-set-form]"), { timeout: 200 });
  }
}

export function serializeTestGroup(group: Group): any {
  return {
    members: Array.from(group.members)
  }
}