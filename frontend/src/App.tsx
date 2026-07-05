import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ToastProvider } from './contexts/ToastContext';
import { ConnectionIndicator } from './components/ui/ConnectionIndicator';
import { LoginForm } from './features/auth/LoginForm';
import { BookingWizard } from './features/booking/BookingWizard';
import { Dashboard as AdminDashboard } from './features/admin/Dashboard';
import { ChangePasswordForm } from './features/auth/ChangePasswordForm';
import { LandingPage } from './features/home/LandingPage';



// Componente para proteger rotas exclusivas do Administrador
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Verificando credenciais...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (user.mustChangePassword) return <Navigate to="/alterar-senha" />;
  if (!user.isAdmin) return <Navigate to="/agendar" />;

  return <>{children}</>;
};

// Componente para proteger a tela de alteração obrigatória de senha
const ChangePasswordRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Verificando sessão...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  
  if (!user.mustChangePassword) {
    return user.isAdmin ? <Navigate to="/admin" /> : <Navigate to="/agendar" />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      {/* Indicador visual de saúde da conexão de rede e do backend */}
      <ConnectionIndicator />

      {/* Barra superior de apresentação da barbearia */}
      <header className="app-header-brand">
        <div className="app-header-brand__container">
          <h1 className="app-logo">ROCHA <span className="app-logo-gold">20</span></h1>
          <span className="app-tagline">Ritual de Estilo e Confiança</span>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          {/* Rota Inicial / Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Rotas Públicas */}
          <Route 
            path="/login" 
            element={
              user ? (
                user.mustChangePassword ? <Navigate to="/alterar-senha" /> :
                user.isAdmin ? <Navigate to="/admin" /> : <Navigate to="/agendar" />
              ) : <LoginForm />
            } 
          />

          {/* Rota Protegida de Redefinição Obrigatória de Senha */}
          <Route 
            path="/alterar-senha" 
            element={
              <ChangePasswordRoute>
                <ChangePasswordForm />
              </ChangePasswordRoute>
            } 
          />

          {/* Rota Pública de Agendamento */}
          <Route path="/agendar" element={<BookingWizard />} />

          {/* Rota Protegida do Admin */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* Redirecionamento Padrão */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
