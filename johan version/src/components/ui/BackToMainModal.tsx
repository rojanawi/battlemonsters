import React from 'react';
import { ChevronLeft, X, AlertTriangle } from 'lucide-react';

interface BackToMainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  panelCount: number;
}

export function BackToMainModal({ isOpen, onClose, onConfirm, panelCount }: BackToMainModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 border border-purple-500/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600/20 rounded-full">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Return to Main Screen</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-purple-200 leading-relaxed mb-4">
            You have {panelCount} panel{panelCount !== 1 ? 's' : ''} in your current comic strip. 
            Going back to the main screen will lose all your progress.
          </p>
          <div className="p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
            <p className="text-orange-300 text-sm">
              <strong>Warning:</strong> Your current battle comic will be permanently lost and cannot be recovered.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
          >
            Stay Here
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-orange-500/25"
          >
            Go Back Anyway
          </button>
        </div>
      </div>
    </div>
  );
}