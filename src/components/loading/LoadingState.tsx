import { StatusMessage } from "./StatusMessage";

type Props = {
  message?: string;
};

export function LoadingState({ message = "Loading..." }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className="flex min-h-(--content-height) items-center justify-center"
    >
      <StatusMessage message={message} />
    </div>
  );
}
