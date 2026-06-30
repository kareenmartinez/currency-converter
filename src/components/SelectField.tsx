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
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="field-label">
        {label}
      </label>

      <div className="select-field-control">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="field-control field-control-focus select-trigger"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <span className="select-chevron">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
}

export type { SelectOption };
