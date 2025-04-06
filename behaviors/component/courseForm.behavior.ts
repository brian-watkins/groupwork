import { behavior, example, fact, effect, step } from "best-behavior";
import { arrayWith, arrayWithLength, assignedWith, equalTo, expect, objectWith, resolvesTo } from "great-expectations";
import { testableCourseForm } from "./helpers/testableCourseForm";
import { Keys } from "../helpers/displays/display";
import { testStudent } from "../domain/helpers/testStudent";

export default behavior("Course Form component", [

  example(testableCourseForm)
    .description("adding a student by pressing Enter key")
    .script({
      suppose: [
        fact("the form is rendered", async (context) => {
          await context.render();
        })
      ],
      perform: [
        step("enter a student name in the input field", async (context) => {
          await context.display.studentNameInput.type(testStudent(1).name);
        }),
        step("press Enter key in the student name input", async (context) => {
          await context.display.studentNameInput.press(Keys.Enter)
        })
      ],
      observe: [
        effect("the student is added to the students list", async (context) => {
          await expect(context.display.studentNames(), resolvesTo([
            testStudent(1).name
          ]))
        }),
        effect("the student name input is cleared", async (context) => {
          await expect(context.display.studentNameInput.inputValue(), resolvesTo(""));
        })
      ]
    }).andThen({
      perform: [
        step("add another student", async (context) => {
          await context.display.studentNameInput.type(testStudent(2).name);
        }),
        step("press Enter key in the student name input", async (context) => {
          await context.display.studentNameInput.press(Keys.Enter)
        })
      ],
      observe: [
        effect("the second student is added to the top of the list", async (context) => {
          await expect(context.display.studentNames(), resolvesTo([
            testStudent(2).name,
            testStudent(1).name
          ]))
        }),
      ]
    }).andThen({
      perform: [
        step("add another student", async (context) => {
          await context.display.studentNameInput.type(testStudent(3).name);
          await context.display.addStudentButton.click()
        }),
        step("remove the second student", async (context) => {
          await context.display.student(1).removeButton.click()
        })
      ],
      observe: [
        effect("the second student is removed from the list", async (context) => {
          await expect(context.display.studentNames(), resolvesTo([
            testStudent(3).name,
            testStudent(1).name
          ]))
        })
      ]
    }),

  example(testableCourseForm)
    .description("pressing Enter with empty student name does nothing")
    .script({
      suppose: [
        fact("the form is rendered", async (context) => {
          await context.render();
        })
      ],
      perform: [
        step("press Enter key with empty student name input", async (context) => {
          await context.display.studentNameInput.press(Keys.Enter)
        })
      ],
      observe: [
        effect("the students list remains empty", async (context) => {
          await expect(context.display.studentNames(), resolvesTo(arrayWithLength(0)));
        })
      ]
    }),

  example(testableCourseForm)
    .description("disabling save before all data is provided")
    .script({
      suppose: [
        fact("the form is rendered", async (context) => {
          await context.render()
        })
      ],
      observe: [
        effect("the save button is disabled", async (context) => {
          await expect(context.display.saveCourseButton.isEnabled(), resolvesTo(false))
        })
      ]
    }).andThen({
      perform: [
        step("provide a name for the course", async (context) => {
          await context.display.courseNameInput.type("Fun Course")
        })
      ],
      observe: [
        effect("the save button is still disabled", async (context) => {
          await expect(context.display.saveCourseButton.isEnabled(), resolvesTo(false))
        })
      ]
    }).andThen({
      perform: [
        step("add a student", async (context) => {
          await context.display.studentNameInput.type("Fun Student")
          await context.display.studentNameInput.press(Keys.Enter)
        })
      ],
      observe: [
        effect("the save button is enabled", async (context) => {
          await expect(context.display.saveCourseButton.isEnabled(), resolvesTo(true))
        })
      ]
    }).andThen({
      perform: [
        step("remove the student", async (context) => {
          await context.display.student(0).removeButton.click()
        })
      ],
      observe: [
        effect("the save button is disabled again", async (context) => {
          await expect(context.display.saveCourseButton.isEnabled(), resolvesTo(false))
        })
      ]
    }),

  example(testableCourseForm)
    .description("the course is saved")
    .script({
      suppose: [
        fact("the course form is rendered", async (context) => {
          await context.render()
        })
      ],
      perform: [
        step("provide a name for the course", async (context) => {
          await context.display.courseNameInput.type("Fun Course")
        }),
        step("add a student", async (context) => {
          await context.display.studentNameInput.type("Fun Student")
          await context.display.studentNameInput.press(Keys.Enter)
        }),
        step("add another student", async (context) => {
          await context.display.studentNameInput.type("Awesome Student")
          await context.display.studentNameInput.press(Keys.Enter)
        }),
        step("save the course", async (context) => {
          await context.display.saveCourseButton.click()
        })
      ],
      observe: [
        effect("the course details are saved", async (context) => {
          await expect(context.getCreateCourseDetails(), resolvesTo(assignedWith(objectWith({
            name: equalTo("Fun Course"),
            students: arrayWith([
              equalTo("Awesome Student"),
              equalTo("Fun Student")
            ], { withAnyOrder: true })
          }))))
        }),
        effect("the app returns to the main page", async (context) => {
          await expect(context.getReturnToMainCalls(), resolvesTo(1))
        })
      ]
    }),

  example(testableCourseForm)
    .description("creating a course is cancelled")
    .script({
      suppose: [
        fact("the course form is rendered", async (context) => {
          await context.render()
        })
      ],
      perform: [
        step("the cancel button is pressed", async (context) => {
          await context.display.cancelButton.click()
        })
      ],
      observe: [
        effect("the app returns to the main page", async (context) => {
          await expect(context.getReturnToMainCalls(), resolvesTo(1))
        })
      ]
    })

])
