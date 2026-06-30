import { Spinner } from "./Spinner";

type Props = {
  message: string;
};

export function StatusMessage({ message }: Props) {
  return (
    <p
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 text-sm text-brand"
    >
      <Spinner />
      {message}
    </p>
  );
}
