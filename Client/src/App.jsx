import Login from "./pages/Login";
import LocomotiveScroll from "locomotive-scroll";
import HeroSection from "./pages/Student/HeroSection";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/Student/Courses";
import Mylearning from "./pages/Student/Mylearning";
import Profile from "./pages/Student/Profile";
import Sidebar from "./pages/Admin/Sidebar";
import Dashboard from "./pages/Admin/Dashboard";
import CourseTable from "./pages/Admin/course/CourseTable";
import CreateCourse from "./pages/Admin/course/CreateCourse";
import EditCourse from "./pages/Admin/course/EditCourse";
import CreateLecture from "./pages/Admin/lecture/CreateLecture";
import EditLecture from "./pages/Admin/lecture/EditLecture";
import ErrorPage from "./pages/ErrorPage";
import CourseDetail from "./pages/Student/CourseDetail";
import CourseProgress from "./pages/Student/CourseProgress";
import SearchPage from "./pages/Student/SearchPage";
import {
  AdminOnly,
  AuthenticatedUser,
  ProtectedRoutes,
} from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_URL;

axios.get(`${BASE_URL}/api/xyz`);


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <AuthenticatedUser>
            {" "}
            <Login />{" "}
          </AuthenticatedUser>
        ),
      },
      {
        path: "my-learning",
        element: (
          <ProtectedRoutes>
            {" "}
            <Mylearning />{" "}
          </ProtectedRoutes>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoutes>
            {" "}
            <Profile />{" "}
          </ProtectedRoutes>
        ),
      },
      {
        path: "course/search",
        element: (
          <ProtectedRoutes>
            <SearchPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "course-detail/:CourseId",
        element: (
          <ProtectedRoutes>
            <CourseDetail />
          </ProtectedRoutes>
        ),
      },
      {
        path: "course-progress/:CourseId",
        element: (
          <ProtectedRoutes>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoutes>
        ),
      },
      // admin route
      {
        path: "admin",
        element: (
          <AdminOnly>
            <Sidebar />
          </AdminOnly>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "course",
            element: <CourseTable />,
          },
          {
            path: "course/create",
            element: <CreateCourse />,
          },
          {
            path: "course/edit/:CourseId",
            element: <EditCourse />,
          },
          {
            path: "course/edit/:CourseId/lecture",
            element: <CreateLecture />,
          },
          {
            path: "course/edit/:CourseId/lecture/:LectureId",
            element: <EditLecture />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
function App() {
  const locomotiveScroll = new LocomotiveScroll();

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
