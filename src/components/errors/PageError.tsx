import { AlertCircleIcon } from "@/assets/icons/AlertCircleIcon";

import { RetryButton } from "./RetryButton";

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
};

export function PageError({
  title = "Something went wrong",
  message = "Something went wrong. Please try again.",
  onRetry,
  isRetrying = false,
}: Props) {
  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertCircleIcon />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-base leading-relaxed text-gray-600">{message}</p>

        {onRetry && (
          <div className="mt-6">
            <RetryButton onClick={onRetry} isRetrying={isRetrying} />
          </div>
        )}
      </div>
    </div>
  );
}
