import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Organizations from "./pages/Organizations";
import Users from "./pages/Users";
import Properties from "./pages/Properties";
import Subscriptions from "./pages/Subscriptions";
import Maintenance from "./pages/Maintenance";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout />
          }
        >
          <Route
            path="/"
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
            path="/settings"
            element={
              <Settings />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}