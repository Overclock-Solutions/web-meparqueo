import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from 'react-router-dom';

import Login from './pages/Login';
import Page404 from './pages/404';
import Page401 from './pages/401';

import './App.css';
import Sidenav from './components/Sidenav';
import Dashboard from './pages/dashboard';
import Users from './pages/dashboard/Users';
import { Role } from './store/models';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Sidenav children={<Outlet />} />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={[Role.ADMIN, Role.OWNER]}
                children={<Dashboard />}
              />
            }
          />
          <Route
            path="/dashboard/usuarios"
            element={
              <ProtectedRoute
                allowedRoles={[Role.ADMIN]}
                children={<Users />}
              />
            }
          />
        </Route>
        <Route path="/*" element={<Page404 />} />
        <Route path="/unauthorized" element={<Page401 />} />
      </Routes>
    </Router>
  );
}

export default App;
