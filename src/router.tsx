import { createBrowserRouter } from "react-router"
import { Layout } from "@/app/layout"
import { NotFoundPage } from "@/app/not-found"
import { ProtectedRoute } from "@/components/protected-route"
import { LoginPage } from "@/pages/login/page"
import { AuthCallbackPage } from "@/pages/auth/callback"
import { DashboardPage } from "@/pages/dashboard/page"
import { CodeSearchPage } from "@/pages/code-search/page"
import { ApiSearchPage } from "@/pages/api-search/page"
import { ApiDetailPage } from "@/pages/api-search/detail/page"
import { ProjectsPage } from "@/pages/projects/page"
import { ProjectDetailPage } from "@/pages/projects/project-detail"
import { RepositoryHealthPage } from "@/pages/projects/repository-health"

export const router = createBrowserRouter(
  [
    { path: "login", element: <LoginPage /> },
    { path: "auth/callback", element: <AuthCallbackPage /> },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <Layout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: "code", element: <CodeSearchPage /> },
            { path: "apis", element: <ApiSearchPage /> },
            { path: "apis/detail", element: <ApiDetailPage /> },
            { path: "projects", element: <ProjectsPage /> },
            {
              path: "projects/:projectId",
              element: <ProjectDetailPage />,
            },
            {
              path: "projects/:projectId/repos/:repositoryId",
              element: <RepositoryHealthPage />,
            },
            { path: "*", element: <NotFoundPage /> },
          ],
        },
      ],
    },
  ],
  { basename: "/helios" }
)
