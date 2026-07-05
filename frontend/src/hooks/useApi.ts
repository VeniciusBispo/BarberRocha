import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useApi<T, Args extends any[] = any[]>(
  apiFunction: (...args: Args) => Promise<T>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState({
        data: null,
        loading: true,
        error: null,
        success: false,
      });

      try {
        const responseData = await apiFunction(...args);
        setState({
          data: responseData,
          loading: false,
          error: null,
          success: true,
        });
        return responseData;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Algo deu errado na requisição. Tente novamente.';
          
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          success: false,
        });
        throw err;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
