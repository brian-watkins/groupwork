import { behavior, example, fact, effect, step } from "best-behavior";
import { expect, is, stringContaining, equalTo, resolvesTo } from "great-expectations";
import { testGroup } from "../domain/helpers/testGroup";
import { testStudents } from "../domain/helpers/testStudent";
import { testableGroupSetForm } from "./helpers/testableGroupSetForm";

export default behavior("GroupSetForm component", [

  example(testableGroupSetForm)
    .description("attempt to record a group set without a name")
    .script({
      suppose: [
        fact("the form is rendered with groups", async (context) => {
          await context
            .withGroups([testGroup(...testStudents(4))])
            .render()
        })
      ],
      perform: [
        step("click the Record Groups button without entering a name", async (context) => {
          await context.display.recordGroupsButton.click()
        })
      ],
      observe: [
        effect("an error message is displayed", async (context) => {
          await expect(context.display.inputError.isVisible(), resolvesTo(true))
        }),
        effect("the input field has an error style", async (context) => {
          await expect(context.display.groupSetNameInput.attribute("class"), resolvesTo(
            stringContaining("border-red-500")
          ))
        }),
        effect("the onRecordGroups callback is not called", async (context) => {
          const recordedName = await context.getRecordedGroupSetName();
          expect(recordedName, is(equalTo(null)));
        })
      ]
    }),

  example(testableGroupSetForm)
    .description("clear validation error after entering a name")
    .script({
      suppose: [
        fact("the form is rendered with groups", async (context) => {
          await context
            .withGroups([testGroup(...testStudents(4))])
            .render()
        }),
        fact("a validation error is triggered", async (context) => {
          await context.display.recordGroupsButton.click();
          await context.display.inputError.waitForVisible();
        })
      ],
      perform: [
        step("enter a name in the input field", async (context) => {
          await context.display.groupSetNameInput.type("New Name");
        })
      ],
      observe: [
        effect("the error message is no longer visible", async (context) => {
          await expect(context.display.inputError.isHidden(), resolvesTo(true));
        }),
        effect("the input field no longer has an error style", async (context) => {
          await expect(context.display.groupSetNameInput.attribute("class"), resolvesTo(
            stringContaining("border-red-500", { times: 0 })
          ))
        })
      ]
    }),

  example(testableGroupSetForm)
    .description("disable the Record button when isRecording is true")
    .script({
      suppose: [
        fact("the form is rendered with isRecording=true", async (context) => {
          await context
            .withGroups([testGroup(...testStudents(4))])
            .withIsRecording(true)
            .render()
        })
      ],
      observe: [
        effect("the Record Groups button is disabled", async (context) => {
          const isEnabled = await context.display.recordGroupsButton.isEnabled();
          expect(isEnabled, is(false));
        }),
        effect("the button text shows 'Recording...'", async (context) => {
          const buttonText = await context.display.recordGroupsButton.text();
          expect(buttonText, is("Recording..."));
        })
      ]
    })

])