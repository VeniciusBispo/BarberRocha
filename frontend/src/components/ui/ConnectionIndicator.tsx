import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { WifiOff, AlertTriangle } from 'lucide-react';

export const ConnectionIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isApiConnected, setIsApiConnected] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setIsApiConnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Função para checar a saúde do backend
    const checkApiHealth = async () => {
      if (!navigator.onLine) {
        setIsApiConnected(false);
        return;
      }
      try {
        const response = await client.get('/health', { timeout: 3000 });
        if (response.status === 200) {
          setIsApiConnected(true);
        } else {
          setIsApiConnected(false);
        }
      } catch {
        setIsApiConnected(false);
      }
    };

    // Executa check no mount e a cada 15 segundos
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 15000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="connection-banner connection-banner--offline" role="alert">
        <WifiOff size={16} />
        <span>Você está offline. Verifique sua conexão de rede.</span>
      </div>
    );
  }

  if (!isApiConnected) {
    return (
      <div className="connection-banner connection-banner--api-down" role="alert">
        <AlertTriangle size={16} />
        <span>Servidor de agendamentos indisponível. Algumas funções podem não funcionar.</span>
      </div>
    );
  }

  return null; // Conectado e funcionando perfeitamente
};
export default ConnectionIndicator;
