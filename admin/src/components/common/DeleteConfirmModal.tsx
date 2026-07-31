import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteConfirmModal = ({
  isOpen,
  title = 'Delete Confirmation',
  itemTitle,
  onClose,
  onConfirm,
  loading = false,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0F284B] border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white text-center transform transition-all duration-300 scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Trash Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Title & Item Name */}
        <div className="space-y-2">
          <h3 className="text-xl font-heading font-bold text-white">{title}</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Are you sure you want to delete{' '}
            {itemTitle ? (
              <strong className="text-red-400 font-semibold">&quot;{itemTitle}&quot;</strong>
            ) : (
              'this item'
            )}
            ? This operation cannot be reversed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-5 rounded-xl border border-gray-700 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold transition-colors text-xs sm:text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
