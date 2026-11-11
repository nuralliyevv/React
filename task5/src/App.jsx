import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout.jsx";
import Loading from "./components/Loading.jsx";
import Home from "./pages/Home.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

const About = lazy(() => import("./pages/About.jsx"));
const Items = lazy(() => import("./pages/Items.jsx"));
const ItemDetails = lazy(() => import("./pages/ItemDetails.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "items", element: <Items /> },
      { path: "items/:id", element: <ItemDetails /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { element: <RequireAuth />, children: [{ path: "profile", element: <Profile /> }] },
      { path: "*", element: <NotFound /> },
    ],
  },
], { basename: import.meta.env.BASE_URL.replace(/\/$/, "") });

export default function App() {
  return (
    <Suspense fallback={<Loading label="Opening page…" />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
