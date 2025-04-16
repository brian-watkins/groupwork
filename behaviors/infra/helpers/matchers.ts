import { Matcher, objectWith, objectWithProperty } from "great-expectations"

export function errorWithMessage<X extends { message: string }>(
  expected: Matcher<string>,
): Matcher<X> {
  return objectWithProperty("message", expected)
}
