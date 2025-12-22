import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
  customerName: string;
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  companyName,
  customerName,
}: DeleteConfirmModalProps) => {
  const { t } = useTranslation(['customers', 'common']);
  const [inputValue, setInputValue] = useState('');
  const confirmText = companyName || customerName;

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (inputValue === confirmText) {
      onConfirm();
      setInputValue('');
    }
  };

  const isValid = inputValue === confirmText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="material-icons">warning</span>
            {t('delete', { ns: 'customers' })}
          </h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 dark:text-slate-300">
            {t('messages.deleteConfirm', { ns: 'customers' })}
          </p>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-300 mb-2">
              Geben Sie zur Bestätigung ein: <strong className="font-mono">{confirmText}</strong>
            </p>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmText}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-red-300 dark:border-red-500/30 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
          </div>

          <p className="text-sm text-gray-600 dark:text-slate-400">
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => {
              onClose();
              setInputValue('');
            }}
            className="px-6 py-2.5 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            {t('cancel', { ns: 'common' })}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('delete', { ns: 'customers' })}
          </button>
        </div>
      </div>
    </div>
  );
};
