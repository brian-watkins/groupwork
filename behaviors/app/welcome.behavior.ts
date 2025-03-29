import { behavior, effect, example, fact } from "best-behavior";
import { testableApp } from "./helpers/testableApp";
import { expect, resolvesTo, stringContaining } from "great-expectations";

export default behavior("welcome", [

  example(testableApp)
    .description("load the app")
    .script({
      suppose: [
        fact("the app is loaded", async (context) => {
          await context.load()
        })
      ],
      observe: [
        effect("the welcome page is displayed", async (context) => {
          await expect(context.page.locator("h1").innerText({ timeout: 5000 }),
            resolvesTo(stringContaining("Welcome"))
          )
        })
      ]
    })

])