import { useWithContext } from "best-behavior";
import { browserContext } from "best-behavior/browser";

export const useBrowser = useWithContext({
  browser: browserContext()
})
