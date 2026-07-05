import React, { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string | null>>;
  onSubmit: (values: T) => Promise<void> | void;
  maskFields?: Partial<Record<keyof T, (val: string) => string>>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
  maskFields,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string | null>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      let formattedValue = value;

      // Se houver máscara para este campo, aplica
      if (maskFields && maskFields[name] && typeof value === 'string') {
        formattedValue = maskFields[name]!(value);
      }

      setValues((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      // Limpa erro do campo ao digitar
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    },
    [errors, maskFields]
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      if (validate) {
        const validationErrors = validate(values);
        setErrors((prev) => ({
          ...prev,
          [name]: validationErrors[name] || null,
        }));
      }
    },
    [validate, values]
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setIsSubmitting(true);

    // Valida todos os campos antes de submeter
    if (validate) {
      const validationErrors = validate(values);
      const hasErrors = Object.values(validationErrors).some((err) => !!err);
      
      if (hasErrors) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await onSubmit(values);
    } catch (err) {
      console.error('[useForm] Erro durante submissão do formulário:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    resetForm,
  };
}
