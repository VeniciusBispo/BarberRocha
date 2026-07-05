import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { ToastMessage } from '../../types/toast';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const { id, message, type, duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="toast-icon toast-icon--success" />;
      case 'error':
        return <XCircle size={20} className="toast-icon toast-icon--error" />;
      case 'warning':
        return <AlertTriangle size={20} className="toast-icon toast-icon--warning" />;
      case 'info':
      default:
        return <Info size={20} className="toast-icon toast-icon--info" />;
    }
  };

  return (
    <div 
      className={`toast toast--${type}`} 
      role="alert" 
      aria-live="assertive"
      style={{ '--toast-duration': `${duration}ms` } as React.CSSProperties}
    >
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{message}</span>
        <button 
          onClick={() => onClose(id)} 
          className="toast-close-btn" 
          aria-label="Fechar notificação"
        >
          <X size={16} />
        </button>
      </div>
      <div className="toast-progress-bar" />
    </div>
  );
};
