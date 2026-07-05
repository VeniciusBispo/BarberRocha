/**
 * Formata um valor de string para máscara de telefone brasileiro (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export const maskPhone = (value: string): string => {
  if (!value) return '';
  
  // Remove qualquer caractere que não seja número
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const limited = numbers.substring(0, 11);
  
  if (limited.length <= 2) {
    return limited;
  }
  
  if (limited.length <= 6) {
    return `(${limited.substring(0, 2)}) ${limited.substring(2)}`;
  }
  
  if (limited.length <= 10) {
    return `(${limited.substring(0, 2)}) ${limited.substring(2, 6)}-${limited.substring(6)}`;
  }
  
  return `(${limited.substring(0, 2)}) ${limited.substring(2, 7)}-${limited.substring(7)}`;
};

/**
 * Remove qualquer máscara ou caractere não numérico da string
 */
export const unmask = (value: string): string => {
  return value.replace(/\D/g, '');
};
