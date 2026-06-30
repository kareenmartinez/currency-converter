import { Spinner } from "@/components/loading/Spinner";

type Props = {
  onClick: () => void;
  isRetrying?: boolean;
};

export function RetryButton({ onClick, isRetrying = false }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isRetrying}
      className="btn-primary"
    >
      {isRetrying && <Spinner />}
      {isRetrying ? "Retrying..." : "Try again"}
    </button>
  );
}
