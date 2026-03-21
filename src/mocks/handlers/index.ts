import { codeHandlers } from "./code"
import { apiHandlers } from "./api"
import { projectHandlers } from "./projects"

export const handlers = [...codeHandlers, ...apiHandlers, ...projectHandlers]
