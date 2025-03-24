import { Route, createRoutesFromElements } from "react-router-dom";
import Layout from "./Layout";

// Pages imports
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

const Routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    {/* Routes for different pages */}
    <Route path="" element={<Home />} />
    <Route path="dashboard" element={<Dashboard />} />

    {/* Add other pages below */}
  </Route>
);

export default Routes;
