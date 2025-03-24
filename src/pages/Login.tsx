import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth/authStore';
import { notifications } from '@mantine/notifications';

const AuthenticationTitle = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isAuthenticated, isLoading, errors, clearError } =
    useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({
      email: formData.email.replace(/\s/g, ''),
      password: formData.password,
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      notifications.show({
        title: 'Inicio de sesión exitoso',
        message: 'Redirigiendo al panel...',
        color: 'green',
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (errors.length > 0) {
      notifications.show({
        title: 'Error',
        message: errors[errors.length - 1],
        color: 'red',
      });
      clearError();
    }
  }, [errors, clearError]);

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center p-5">
          <h2 className="text-center mb-4">Bienvenido de nuevo a Me Parqueo</h2>
          <div className="card shadow-sm w-100" style={{ maxWidth: '400px' }}>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">
                    Correo
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Tu correo"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Tu contraseña"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Columna para la imagen */}
        <div className="col-lg-6 d-none d-lg-block">
          <img
            src="https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80"
            alt="Background"
            className="img-fluid vh-100"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthenticationTitle;
