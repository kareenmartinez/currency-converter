type Props = {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  onChange: (value: string) => void;
};

export function AmountInput({
  id,
  label,
  value,
  prefix,
  onChange,
}: Props) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="field-label">
        {label}
      </label>

      <div className="field-control field-control-focus-within amount-field">
        {prefix && (
          <span className="flex shrink-0 items-center pl-4 text-base text-gray-900">
            {prefix}
          </span>
        )}

        <input
          id={id}
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          value={Number.isFinite(value) ? value : 0}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 cursor-pointer border-0 py-3.5 pl-2 pr-4 outline-none"
        />
      </div>
    </div>
  );
}
