import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import Dashboard from "./pages/Dashboard";
import Organizations from "./pages/Organizations";
import Users from "./pages/Users";
import Properties from "./pages/Properties";
import Subscriptions from "./pages/Subscriptions";
import Maintenance from "./pages/Maintenance";
import Settings from "./pages/Settings";
import Signin from "./pages/Signin";
import ConstructionProjects from "./pages/ConstructionProjects";
import Payments from "./pages/Payments";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />


      <Route element={<ProtectedAdminRoute />}>
        <Route
          element={
            <Layout />
          }
        >
          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />

          <Route
            path="/organizations"
            element={
              <Organizations />
            }
          />

          <Route
            path="/users"
            element={
              <Users />
            }
          />

          <Route
            path="/properties"
            element={
              <Properties />
            }
          />

          <Route
            path="/subscriptions"
            element={
              <Subscriptions />
            }
          />

          <Route
            path="/maintenance"
            element={
              <Maintenance />
            }
          />

          <Route
            path="/construction-projects"
            element={<ConstructionProjects />}
          />

          <Route path="/payments" element={<Payments />} />

          <Route
            path="/settings"
            element={
              <Settings />
            }
          />
        </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}