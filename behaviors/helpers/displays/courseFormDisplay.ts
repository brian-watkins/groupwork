import { DisplayElement, TestDisplay } from "./display"

export class CourseFormDisplay extends TestDisplay {
  get courseNameInput(): DisplayElement {
    return this.select("[data-course-name-input]")
  }

  get studentNameInput(): DisplayElement {
    return this.select("[data-student-name-input]")
  }

  get addStudentButton(): DisplayElement {
    return this.select("[data-add-student-button]")
  }

  get saveCourseButton(): DisplayElement {
    return this.select("[data-save-course-button]")
  }

  get cancelButton(): DisplayElement {
    return this.select("[data-cancel-button]")
  }

  studentNames(): Promise<Array<string>> {
    return this.selectAll("[data-student]")
      .map(el => el.selectDescendant("[data-student-name]").text())
  }

  studentByName(name: string): StudentElement {
    return new StudentElement(this.page.locator(`[data-student]:has-text("${name}")`), this.options)
  }

  student(index: number): StudentElement {
    return new StudentElement(this.page.locator("[data-student]").nth(index), this.options)
  }
}

export class StudentElement extends DisplayElement {
  get name(): DisplayElement {
    return this.selectDescendant("[data-student-name]")
  }

  get removeButton(): DisplayElement {
    return this.selectDescendant("[data-remove-student]")
  }
}