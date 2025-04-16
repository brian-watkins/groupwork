import { behavior, example, fact, effect, step } from "best-behavior"
import { expect, stringContaining, resolvesTo } from "great-expectations"
import { testStudents } from "../domain/helpers/testStudent"
import { testableGroupSetForm } from "./helpers/testableGroupSetForm"

export default behavior("GroupSetForm component", [
  example(testableGroupSetForm)
    .description("group set name field validation")
    .script({
      suppose: [
        fact("the form is rendered with groups", async (context) => {
          await context.withStudents(testStudents(4)).render()
        }),
      ],
      perform: [
        step(
          "click the Record Groups button without entering a name",
          async (context) => {
            await context.display.recordGroupsButton.click()
          },
        ),
      ],
      observe: [
        effect("an error message is displayed", async (context) => {
          await expect(context.display.inputError.isVisible(), resolvesTo(true))
        }),
        effect("the input field has an error style", async (context) => {
          await expect(
            context.display.groupSetNameInput.attribute("class"),
            resolvesTo(stringContaining("border-red-500")),
          )
        }),
        effect("the record groups action is not called", async (context) => {
          await expect(context.calledRecordGroups(), resolvesTo(false))
        }),
      ],
    })
    .andThen({
      perform: [
        step("enter a name in the input field", async (context) => {
          await context.display.groupSetNameInput.type("New Name")
        }),
      ],
      observe: [
        effect("the error message is no longer visible", async (context) => {
          await expect(context.display.inputError.isHidden(), resolvesTo(true))
        }),
        effect(
          "the input field no longer has an error style",
          async (context) => {
            await expect(
              context.display.groupSetNameInput.attribute("class"),
              resolvesTo(stringContaining("border-red-500", { times: 0 })),
            )
          },
        ),
      ],
    }),

  example(testableGroupSetForm)
    .description("disable the Record button when isRecording is true")
    .script({
      suppose: [
        fact("the form is rendered with isRecording=true", async (context) => {
          await context.withStudents(testStudents(4)).render()
        }),
      ],
      perform: [
        step("enter a name in the input field", async (context) => {
          await context.display.groupSetNameInput.type("Fun Groups")
        }),
        step("click the record groups button", async (context) => {
          await context.display.recordGroupsButton.click()
        }),
      ],
      observe: [
        effect("the Record Groups button is disabled", async (context) => {
          await expect(
            context.display.recordGroupsButton.isEnabled(),
            resolvesTo(false),
          )
        }),
      ],
    })
    .andThen({
      perform: [
        step("the record groups action completes", async (context) => {
          await context.completeRecordGroupSetsAction()
        }),
      ],
      observe: [
        effect("the Record Groups button is enabled", async (context) => {
          await expect(
            context.display.recordGroupsButton.isEnabled(),
            resolvesTo(true),
          )
        }),
      ],
    }),
])
