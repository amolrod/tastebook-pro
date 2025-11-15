import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="font-semibold text-lg mb-2">Error al cargar</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
