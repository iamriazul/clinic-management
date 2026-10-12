import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, type = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="confirm-dialog">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel}></div>

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${type === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
            <AlertTriangle size={24} className={type === 'danger' ? 'text-red-600' : 'text-amber-600'} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
              type === 'danger'
                ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                : 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
            } shadow-lg hover:shadow-xl`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
