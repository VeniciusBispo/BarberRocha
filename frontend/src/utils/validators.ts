/**
 * Valida se um nome completo tem pelo menos duas partes e tamanho mínimo
 */
export const validateName = (name: string): string | null => {
  if (!name.trim()) return 'Nome é obrigatório';
  if (name.trim().length < 3) return 'O nome deve ter no mínimo 3 caracteres';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return 'Por favor, insira seu nome completo (Nome e Sobrenome)';
  
  return null;
};

/**
 * Valida se um número de telefone celular é válido no padrão brasileiro (com DDD)
 */
export const validatePhone = (phone: string): string | null => {
  const digits = phone.replace(/\D/g, '');
  
  if (!digits) return 'Telefone é obrigatório';
  
  // Admin pode logar com "viny159" ou "Rocha123" que têm letras, então permitimos se houver letras no login.
  // Mas para o telefone normal, deve ter entre 10 e 11 dígitos.
  if (/[a-zA-Z]/.test(phone)) {
    return null; // Ignora validação de tamanho para usernames de admins
  }
  
  if (digits.length < 10 || digits.length > 11) {
    return 'Telefone inválido. Deve conter DDD + número (10 ou 11 dígitos)';
  }
  
  return null;
};

/**
 * Valida requisitos mínimos para senhas
 */
export const validatePassword = (password: string): string | null => {
  if (!password) return 'Senha é obrigatória';
  if (password.length < 3) return 'A senha deve conter pelo menos 3 caracteres';
  
  return null;
};
