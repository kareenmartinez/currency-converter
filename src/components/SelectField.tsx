import { useState } from "react";

import { ChevronDownIcon } from "@/assets/icons/ChevronDownIcon";

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props = {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

export function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption?.label ?? value;

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="field-label">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          id={id}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="field-control field-control-focus select-trigger"
        >
          <span className="block min-w-0 truncate" title={selectedLabel}>
            {selectedLabel}
          </span>
        </button>

        {open && (
          <>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpen(false)}
            />

            <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto overscroll-contain rounded-lg border border-gray-300 bg-white py-1 shadow-lg">
              {options.map((option) => {
                const isSelected = option.value === value;
                const isDisabled = option.disabled === true;

                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={isDisabled}
                      disabled={isDisabled}
                      data-selected={isSelected && !isDisabled ? true : undefined}
                      data-disabled={isDisabled || undefined}
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className="select-option"
                    >
                      <span className="block min-w-0 truncate" title={option.label}>
                        {option.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
}

export type { SelectOption };
