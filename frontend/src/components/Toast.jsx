import { X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Toast() {
  const { toast, hideToast } = useToast();

  if (!toast) return null;

  const typeClass = {
    success: 'toast-success',
    error: 'toast-error',
    info: 'toast-info',
  }[toast.type] || 'toast-info';

  return (
    <div className={`toast ${typeClass} flex items-center gap-3`} id="toast-notification">
      <span>{toast.message}</span>
      <button onClick={hideToast} className="ml-2 hover:opacity-80 transition-opacity">
        <X size={18} />
      </button>
    </div>
  );
}
