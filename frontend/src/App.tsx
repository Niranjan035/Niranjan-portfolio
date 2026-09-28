import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import { ErrorBoundary } from './components/ErrorBoundary'

/*
 * Route-level code splitting. The home page is bundled eagerly because it is the
 * entry point for most visitors; everything else loads on demand.
 */
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('./pages/ShoonyaPage'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'))
const ResumePage = lazy(() => import('./pages/ResumePage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },
      { path: 'skills', element: <SkillsPage /> },
      { path: 'experience', element: <ExperiencePage /> },
      { path: 'resume', element: <ResumePage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}
