import { createBrowserRouter } from "react-router"
import { Layout } from "@/app/layout"
import { NotFoundPage } from "@/app/not-found"
import { DashboardPage } from "@/pages/dashboard/page"
import { CodeSearchPage } from "@/pages/code-search/page"
import { ApiSearchPage } from "@/pages/api-search/page"
import { ProjectsPage } from "@/pages/projects/page"
import { ProjectDetailPage } from "@/pages/projects/project-detail"
import { RepositoryHealthPage } from "@/pages/projects/repository-health"

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "code", element: <CodeSearchPage /> },
        { path: "apis", element: <ApiSearchPage /> },
        { path: "projects", element: <ProjectsPage /> },
        { path: "projects/:projectId", element: <ProjectDetailPage /> },
        {
          path: "projects/:projectId/repos/:repositoryId",
          element: <RepositoryHealthPage />,
        },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: "/helios" }
)
