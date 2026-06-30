import { formatNumber } from "@/utils/format";

const DEFAULT_MAX_LENGTH = 16;

type Props = {
  value: number;
  fractionDigits?: number;
  maxLength?: number;
  className?: string;
};

export function FormattedNumber({
  value,
  fractionDigits,
  maxLength = DEFAULT_MAX_LENGTH,
  className,
}: Props) {
  const decimals =
    fractionDigits ?? (Number.isInteger(value) ? 0 : 2);

  const full = formatNumber(value, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const isTruncated = full.length > maxLength;
  const display = isTruncated ? `${full.slice(0, maxLength)}...` : full;

  return (
    <span
      className={`formatted-number${isTruncated ? " formatted-number-truncated" : ""}${className ? ` ${className}` : ""}`}
      title={isTruncated ? full : undefined}
      aria-label={isTruncated ? `${display}. Full value: ${full}` : undefined}
    >
      {display}
    </span>
  );
}
