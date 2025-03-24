import { useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import CollapseSidenav from './CollapseSidenav';
import {
  IconDashboard,
  IconLogout,
  IconMenu2,
  IconUser,
  IconUserCircle,
  IconUsers,
  IconParking,
} from '@tabler/icons-react';
import { useAuthStore } from '../../store/auth/authStore';
import './styles.css';

interface SidebarToggleEvent extends Event {
  preventDefault: () => void;
}

function Sidenav({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', handleSidebarToggle);
      return () => {
        sidebarToggle.removeEventListener('click', handleSidebarToggle);
      };
    }
  }, []);

  const handleSidebarToggle = (event: SidebarToggleEvent): void => {
    event.preventDefault();
    document.body.classList.toggle('sb-sidenav-toggled');
    localStorage.setItem(
      'sb|sidebar-toggle',
      document.body.classList.contains('sb-sidenav-toggled').toString(),
    );
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  return (
    <>
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        {/* Navbar Brand */}
        <p className="navbar-brand ps-3">Me Parqueo</p>
        {/* Sidebar Toggle */}
        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          id="sidebarToggle"
        >
          <IconMenu2 />
        </button>
        <div className="d-none d-md-inline-block ms-auto"></div>
        {/* Navbar */}
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              href="#!"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <IconUser />
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <span className="dropdown-item">
                  {`${user?.person?.names} ${user?.person?.lastNames}`}
                </span>
              </li>
              <hr className="dropdown-divider" />
              <li>
                <button
                  className="btn btn-primary dropdown-item d-flex flex-row align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-perfil"
                >
                  <IconUserCircle className="text-gray-800" size={20} /> Mi
                  perfil
                </button>
              </li>
              <li>
                <button
                  className="btn btn-warning dropdown-item d-flex flex-row align-items-center"
                  onClick={handleLogout}
                >
                  <IconLogout className="text-gray-800" size={20} />
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav
            className="sb-sidenav accordion sb-sidenav-dark"
            id="sidenavAccordion"
          >
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">CENTRO</div>
                <Link className="nav-link" to={'/dashboard'}>
                  <div className="sb-nav-link-icon">
                    <IconDashboard />
                  </div>
                  Dashboard
                </Link>

                <div className="sb-sidenav-menu-heading">APLICACIÓN</div>
                <Link className="nav-link" to={'/dashboard/usuarios'}>
                  <div className="sb-nav-link-icon">
                    <IconUsers />
                  </div>
                  Usuarios
                </Link>

                <CollapseSidenav
                  icon={<IconParking />}
                  name="Parqueaderos"
                  links={[
                    { to: '/dashboard/parqueaderos', name: 'Todos' },
                    { to: '/dashboard/nodos', name: 'Nodos' },
                  ]}
                />
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Conectado como:</div>
              {user?.role === 'ADMIN'
                ? 'Administrador'
                : user?.role === 'OWNER'
                  ? 'Dueño'
                  : 'Usuario'}
            </div>
          </nav>
        </div>
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">{children}</div>
          </main>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="modal-perfil"
        tabIndex={-1}
        aria-labelledby="modal-perfil"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal-perfil">
                Mi perfil
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <figure className="d-flex justify-content-center avatar avatar-nav">
                <img
                  src="https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg"
                  alt="nombre usuario"
                  className="rounded-circle"
                  width={80}
                  height={80}
                />
              </figure>
              <h5 className="text-center mt-2 text-capitalize">
                {`${user?.person?.names} ${user?.person?.lastNames}`}
              </h5>
              <div className="d-flex justify-content-center mt-2">
                <span className="badge bg-secondary me-1">{user?.role}</span>
              </div>
              <div className="text-center">
                <b>Correo: </b>
                {user?.email}
                <br />
                <b>Registrado el: </b>
                {user?.createdAt?.split('T')[0]}
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidenav;
