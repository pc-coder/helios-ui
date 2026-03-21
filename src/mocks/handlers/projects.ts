import { http, HttpResponse } from "msw"
import { projectsList, projectDetails, repositoryHealthDetails } from "../data/projects"

const BASE = "/api/helios/v1/projects"

export const projectHandlers = [
  http.get(BASE, () => {
    return HttpResponse.json({ projects: projectsList })
  }),

  http.get(`${BASE}/:projectId`, ({ params }) => {
    const { projectId } = params as { projectId: string }
    const project = projectDetails[projectId]

    if (!project) {
      return HttpResponse.json(
        { error: { code: "not_found", message: `Project '${projectId}' not found` } },
        { status: 404 }
      )
    }

    return HttpResponse.json(project)
  }),

  http.get(`${BASE}/:projectId/repositories/:repositoryId`, ({ params }) => {
    const { projectId, repositoryId } = params as {
      projectId: string
      repositoryId: string
    }

    const projectRepos = repositoryHealthDetails[projectId]
    if (!projectRepos) {
      return HttpResponse.json(
        { error: { code: "not_found", message: `Project '${projectId}' not found` } },
        { status: 404 }
      )
    }

    const repo = projectRepos[repositoryId]
    if (!repo) {
      return HttpResponse.json(
        { error: { code: "not_found", message: `Repository '${repositoryId}' not found` } },
        { status: 404 }
      )
    }

    return HttpResponse.json(repo)
  }),
]
