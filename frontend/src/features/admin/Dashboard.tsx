import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { AppointmentService } from '../../services/appointment.service';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import type { Appointment } from '../../types/auth';
import { Check, RefreshCw, LogOut, Search, Calendar, UserCheck, Clock, CheckSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

export const Dashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros de busca
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AppointmentService.getAllAdmin();
      // O backend retorna { success: true, count: N, data: [...] }
      setAppointments(response.data || response || []);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Erro ao carregar agendamentos. Verifique se você é um administrador.'
      );
      showToast('Falha ao carregar agendamentos.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'completed') => {
    try {
      await AppointmentService.updateStatus(id, status);
      showToast(`Agendamento atualizado para ${status === 'confirmed' ? 'Confirmado' : 'Concluído'}!`, 'success');
      
      // Atualiza o estado de forma reativa localmente
      setAppointments(prev => 
        prev.map(app => app._id === id ? { ...app, status } : app)
      );
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Falha ao atualizar status do agendamento.', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    } catch {
      return dateString;
    }
  };

  // Cálculo das estatísticas do painel
  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter(app => app.status === 'pending').length;
    const confirmed = appointments.filter(app => app.status === 'confirmed').length;
    const completed = appointments.filter(app => app.status === 'completed').length;
    
    return { total, pending, confirmed, completed };
  }, [appointments]);

  // Filtragem dos agendamentos
  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      const clientName = (app.userId?.name || '').toLowerCase();
      const serviceName = (app.service || '').toLowerCase();
      const barberName = (app.barber || '').toLowerCase();
      const search = searchTerm.toLowerCase();
      
      const matchesSearch = 
        clientName.includes(search) || 
        serviceName.includes(search) || 
        barberName.includes(search);
        
      const matchesStatus = 
        statusFilter === 'all' || 
        app.status === statusFilter;
        
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Painel Administrativo</h1>
          <p className="admin-subtitle">Bem-vindo, {user?.name || 'Administrador'}! Gerencie a agenda da barbearia.</p>
        </div>
        <div className="admin-header__actions">
          <Button onClick={fetchAppointments} variant="secondary" className="btn-refresh" title="Atualizar dados">
            <RefreshCw size={18} />
          </Button>
          <Button onClick={logout} variant="danger" className="btn-logout" title="Sair da conta">
            <LogOut size={18} /> Sair
          </Button>
        </div>
      </header>

      {/* Cartões de Estatísticas */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon"><Calendar size={24} /></div>
          <div className="stat-card__content">
            <span className="stat-card__title">Total de Agendamentos</span>
            <strong className="stat-card__value">{stats.total}</strong>
          </div>
        </div>
        <div className="stat-card stat-card--pending">
          <div className="stat-card__icon"><Clock size={24} /></div>
          <div className="stat-card__content">
            <span className="stat-card__title">Pendentes</span>
            <strong className="stat-card__value">{stats.pending}</strong>
          </div>
        </div>
        <div className="stat-card stat-card--confirmed">
          <div className="stat-card__icon"><UserCheck size={24} /></div>
          <div className="stat-card__content">
            <span className="stat-card__title">Confirmados</span>
            <strong className="stat-card__value">{stats.confirmed}</strong>
          </div>
        </div>
        <div className="stat-card stat-card--completed">
          <div className="stat-card__icon"><CheckSquare size={24} /></div>
          <div className="stat-card__content">
            <span className="stat-card__title">Concluídos</span>
            <strong className="stat-card__value">{stats.completed}</strong>
          </div>
        </div>
      </div>

      {error ? (
        <div className="alert alert--error">
          <h3>Erro de Acesso</h3>
          <p>{error}</p>
          <Button onClick={fetchAppointments} variant="primary" style={{ marginTop: '12px' }}>Tentar Novamente</Button>
        </div>
      ) : (
        <div className="admin-content">
          <div className="admin-card">
            
            {/* Barra de Filtros e Busca */}
            <div className="admin-filters-bar">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Pesquisar por cliente, serviço ou barbeiro..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  aria-label="Buscar agendamentos"
                />
              </div>
              
              <div className="filter-select-wrapper">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                  aria-label="Filtrar por status"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="completed">Concluído</option>
                </select>
              </div>
            </div>

            <h3 className="admin-card__title" style={{ marginTop: '20px' }}>
              Agendamentos Registrados ({filteredAppointments.length})
            </h3>
            
            {loading ? (
              <div style={{ padding: '20px 0' }}>
                <Skeleton variant="rect" height="50px" width="100%" count={6} className="table-skeleton" />
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>WhatsApp</th>
                      <th>Serviço</th>
                      <th>Barbeiro</th>
                      <th>Data / Hora</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((app) => (
                      <tr key={app._id}>
                        <td><strong>{app.userId?.name || 'Cliente'}</strong></td>
                        <td>{app.userId?.phone || '-'}</td>
                        <td>{app.service} (R$ {app.price})</td>
                        <td>{app.barber}</td>
                        <td>{formatDate(app.date)} às {app.time}</td>
                        <td>
                          <span className={`badge-status badge-status--${app.status}`}>
                            {app.status === 'pending' ? 'Pendente' : app.status === 'confirmed' ? 'Confirmado' : 'Concluído'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {app.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateStatus(app._id, 'confirmed')} 
                                  className="action-btn action-btn--confirm"
                                  title="Confirmar agendamento"
                                >
                                  <Check size={14} /> Confirmar
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(app._id, 'completed')} 
                                  className="action-btn action-btn--complete"
                                  title="Concluir agendamento"
                                  style={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' }}
                                >
                                  <CheckSquare size={14} /> Concluir
                                </button>
                              </>
                            )}
                            {app.status === 'confirmed' && (
                              <button 
                                onClick={() => handleUpdateStatus(app._id, 'completed')} 
                                className="action-btn action-btn--complete"
                                title="Concluir agendamento"
                                style={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' }}
                              >
                                <CheckSquare size={14} /> Concluir
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredAppointments.length === 0 && (
                      <tr>
                        <td colSpan={7} className="no-data">Nenhum agendamento encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
