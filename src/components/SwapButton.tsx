import { SwapIcon } from "@/assets/icons/SwapIcon";

type Props = {
  onClick: () => void;
};

export function SwapButton({ onClick }: Props) {
  return (
    <div className="flex justify-center px-2 pb-1 max-md:justify-start max-md:px-0">
      <button
        type="button"
        aria-label="Swap currencies"
        onClick={onClick}
        className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-brand text-brand transition-colors hover:bg-brand-soft"
      >
        <SwapIcon />
      </button>
    </div>
  );
}
