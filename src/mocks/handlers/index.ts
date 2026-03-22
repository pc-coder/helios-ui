import { codeHandlers } from "./code"
import { apiHandlers } from "./api"
import { projectHandlers } from "./projects"
import { authHandlers } from "./auth"

export const handlers = [
  ...codeHandlers,
  ...apiHandlers,
  ...projectHandlers,
  ...authHandlers,
]
