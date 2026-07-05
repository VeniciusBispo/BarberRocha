import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { validatePhone, validatePassword } from '../../utils/validators';
import { maskPhone } from '../../utils/masks';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validator = (values: { phone: string; password?: string }) => {
    return {
      phone: validatePhone(values.phone),
      password: validatePassword(values.password || ''),
    };
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues: { phone: '', password: '' },
    validate: validator,
    maskFields: {
      phone: (val) => {
        // Se houver letras (caso dos usernames de admin 'viny159'), não aplica máscara
        return /[a-zA-Z]/.test(val) ? val : maskPhone(val);
      }
    },
    onSubmit: async (formValues) => {
      // Limpa os caracteres se for telefone puro
      const formattedPhone = /[a-zA-Z]/.test(formValues.phone)
        ? formValues.phone
        : formValues.phone.replace(/\D/g, '');

      const result = await login({ phone: formattedPhone, password: formValues.password });

      if (result.success) {
        showToast('Login realizado com sucesso!', 'success');
        
        // Redireciona de acordo com o cargo
        const storedUser = localStorage.getItem('@Rocha20:user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.mustChangePassword) {
            navigate('/alterar-senha');
          } else if (parsedUser.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/agendar');
          }
        } else {
          navigate('/agendar');
        }
      } else {
        showToast(result.error || 'Credenciais inválidas.', 'error');
      }
    },
  });

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">Acessar Conta</h2>
      <p className="auth-card__subtitle">Entre com seus dados para agendar ou ver seus horários.</p>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <Input
          label="WhatsApp (Telefone)"
          type="text"
          placeholder="Seu telefone cadastrado ou admin..."
          value={values.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          error={errors.phone}
          disabled={isSubmitting}
          required
        />

        <Input
          label="Senha"
          type="password"
          placeholder="Digite sua senha..."
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          error={errors.password}
          disabled={isSubmitting}
          required
        />

        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          loading={isSubmitting}
        >
          Entrar no Sistema
        </Button>
      </form>
    </div>
  );
};
export default LoginForm;
