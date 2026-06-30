import { AlertCircleIcon } from "@/assets/icons/AlertCircleIcon";

import { RetryButton } from "./RetryButton";

type Props = {
  title: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
};

export function InlineError({
  title,
  message,
  onRetry,
  isRetrying = false,
}: Props) {
  return (
    <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
          <AlertCircleIcon />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-900">{title}</p>
          <p className="mt-1 text-sm text-red-700">{message}</p>

          {onRetry && (
            <div className="mt-4">
              <RetryButton onClick={onRetry} isRetrying={isRetrying} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
