import React, { forwardRef, useState, useEffect, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useDatePicker } from '../hooks/useDatePicker';

import 'react-datepicker/dist/react-datepicker.css';

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  id?: string;
  disabled?: boolean;
}

interface MaskedInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  onCalendarClick?: () => void;
  onDateParsed?: (date: Date | null) => void;
}

/**
 * Applies DD/MM/YYYY mask to input value
 * Only allows digits and auto-inserts slashes
 */
const applyDateMask = (input: string): string => {
  // Remove all non-digits
  const digits = input.replace(/\D/g, '');

  // Build masked string
  let masked = '';
  for (let i = 0; i < digits.length && i < 8; i++) {
    if (i === 2 || i === 4) {
      masked += '/';
    }
    masked += digits[i];
  }

  return masked;
};

/**
 * Parses DD/MM/YYYY string to Date object
 * Returns null if invalid
 */
const parseDateFromMask = (value: string): Date | null => {
  if (value.length !== 10) return null;

  const [day, month, year] = value.split('/').map(Number);

  // Basic validation
  if (!day || !month || !year) return null;
  if (day < 1 || day > 31) return null;
  if (month < 1 || month > 12) return null;
  if (year < 1900 || year > 2100) return null;

  const date = new Date(year, month - 1, day);

  // Verify the date is valid (handles cases like 31/02/2024)
  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
};

/**
 * Custom input with DD/MM/YYYY mask and calendar icon
 */
const MaskedDateInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ value, onChange, placeholder, className, id, disabled, onCalendarClick, onDateParsed }, ref) => {
    const [inputValue, setInputValue] = useState(value || '');

    // Sync with external value changes
    useEffect(() => {
      setInputValue(value || '');
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const maskedValue = applyDateMask(rawValue);

      setInputValue(maskedValue);

      // Notify parent with masked value
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: maskedValue },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }

      // Try to parse the date and notify parent
      if (maskedValue.length === 10 && onDateParsed) {
        const parsedDate = parseDateFromMask(maskedValue);
        if (parsedDate) {
          onDateParsed(parsedDate);
        }
      }
    };

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(className, 'pr-10')}
          id={id}
          disabled={disabled}
          autoComplete="off"
          maxLength={10}
          inputMode="numeric"
        />
        <button
          type="button"
          onClick={onCalendarClick}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary-500 hover:text-primary-700 disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors"
          aria-label="Abrir calendario"
        >
          <Calendar className="h-5 w-5" />
        </button>
      </div>
    );
  }
);

MaskedDateInput.displayName = 'MaskedDateInput';

/**
 * DatePicker Component
 * A wrapper around react-datepicker with consistent styling and locale support.
 * Uses DD/MM/YYYY format with input mask validation.
 * Calendar opens only when clicking the calendar icon.
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder,
  minDate,
  maxDate,
  className,
  id,
  disabled = false,
}) => {
  const { locale, dateFormat } = useDatePicker();
  const [isOpen, setIsOpen] = useState(false);
  const datePickerRef = useRef<ReactDatePicker>(null);

  const handleCalendarClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleDateChange = (date: Date | null) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <ReactDatePicker
      ref={datePickerRef}
      id={id}
      selected={value}
      onChange={handleDateChange}
      dateFormat={dateFormat}
      locale={locale}
      placeholderText={placeholder}
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      wrapperClassName="w-full"
      showPopperArrow={false}
      autoComplete="off"
      open={isOpen}
      onClickOutside={() => setIsOpen(false)}
      customInput={
        <MaskedDateInput
          placeholder={placeholder}
          className={cn('input-base', className)}
          id={id}
          disabled={disabled}
          onCalendarClick={handleCalendarClick}
          onDateParsed={onChange}
        />
      }
    />
  );
};
