import React from 'react';
import { AuthService } from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { validatePassword } from '../../utils/validators';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Lock, ShieldAlert } from 'lucide-react';

export const ChangePasswordForm: React.FC = () => {
  const { user, completePasswordChange, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validator = (values: { newPassword: string; confirmPassword: string }) => {
    const errs: Record<string, string | null> = {
      newPassword: validatePassword(values.newPassword),
      confirmPassword: null
    };

    if (values.newPassword !== values.confirmPassword) {
      errs.confirmPassword = 'As senhas não coincidem';
    }

    return errs;
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues: { newPassword: '', confirmPassword: '' },
    validate: validator,
    onSubmit: async (formValues) => {
      try {
        await AuthService.changePassword(formValues.newPassword);
        showToast('Senha atualizada com sucesso!', 'success');
        
        // Desmarca a flag de primeiro acesso localmente
        completePasswordChange();
        
        // Redireciona de acordo com o papel
        setTimeout(() => {
          if (user?.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/agendar');
          }
        }, 1000);
      } catch (err: any) {
        showToast(
          err.response?.data?.message || 'Falha ao atualizar a senha. Tente novamente.',
          'error'
        );
      }
    },
  });

  return (
    <div className="auth-card">
      <div style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--color-gold)' }}>
        <ShieldAlert size={48} className="icon-pulse" />
      </div>

      <h2 className="auth-card__title">Primeiro Acesso</h2>
      <p className="auth-card__subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Olá, <strong>{user?.name || 'Administrador'}</strong>! Para a segurança da sua conta, é obrigatório alterar a senha padrão temporária no seu primeiro acesso.
      </p>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <Input
          label="Nova Senha"
          type="password"
          placeholder="Digite sua nova senha..."
          value={values.newPassword}
          onChange={(e) => handleChange('newPassword', e.target.value)}
          onBlur={() => handleBlur('newPassword')}
          error={errors.newPassword}
          disabled={isSubmitting}
          required
        />

        <Input
          label="Confirme a Nova Senha"
          type="password"
          placeholder="Confirme a nova senha..."
          value={values.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          error={errors.confirmPassword}
          disabled={isSubmitting}
          required
        />

        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          loading={isSubmitting}
        >
          <Lock size={16} style={{ marginRight: '8px' }} /> Definir Nova Senha
        </Button>
      </form>

      <div className="auth-card__footer">
        <button 
          onClick={logout} 
          className="btn-logout" 
          style={{ width: '100%', marginTop: '16px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          Voltar e Sair
        </button>
      </div>
    </div>
  );
};
export default ChangePasswordForm;
