import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ value, onChange, placeholder = "Select date", disabled = false, className, id, name }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value ? new Date(e.target.value) : null;
      if (date && onChange) {
        onChange(date);
      }
    };

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return (
      <div className="relative">
        <input
          ref={ref}
          type="date"
          id={id}
          name={name}
          value={value ? formatDate(value) : ''}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "flex h-9 w-full rounded-md border border-card-border bg-input-bg px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-emerald disabled:cursor-not-allowed disabled:opacity-50",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        />
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
