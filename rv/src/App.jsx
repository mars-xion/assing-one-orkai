import { StrictMode, useState } from "react";
import NavBar from "./Navbar";
import Footer from "./components/Footer";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import Search2 from "./pages/Search2";
import Search3 from "./pages/Search3";
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  useNavigate,
} from "@tanstack/react-router";

// Create root component with a better layout
const RootComponent = () => (
  <div className="min-h-screen min-w-screen flex flex-col bg-gray-100">
    <NavBar />
    <main className="flex-grow container mx-auto px-4 py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Root route
const rootRoute = createRootRoute({
  component: RootComponent,
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Settings,
});

// Search route
const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: Search,
});

// Search2 route
const search2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search2",
  component: Search2,
});
// Search3 route
const search3Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search3",
  component: Search3,
});

// Combine routes
const routeTree = rootRoute.addChildren([
  settingsRoute,
  searchRoute,
  search2Route,
  search3Route,
]);

const router = createRouter({
  routeTree,
});

function App() {
  const [translation, setTranslation] = useState(
    localStorage.getItem("preferredTranslation") || "131"
  );
  const [recitation, setRecitation] = useState(
    localStorage.getItem("preferredRecitation") || "1"
  );

  return (
    <StrictMode>
      <RouterProvider
        router={router}
        initialState={{
          translation: translation,
          recitation: recitation,
        }}
      />
    </StrictMode>
  );
}

export default App;
