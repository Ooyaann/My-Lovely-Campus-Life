import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
  count?: number | string;
  color?: string;
  bg?: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Pilih opsi...',
  icon: LeftIcon,
  className = '',
  id,
  ariaLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative ${className}`} id={id}>
      {/* Trigger Button */}
      <button
        type="button"
        aria-label={ariaLabel || placeholder}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50/80 border text-xs font-semibold transition-all cursor-pointer select-none text-left shadow-2xs ${
          isOpen
            ? 'border-rose-800 ring-2 ring-rose-500/20 bg-white shadow-xs'
            : 'border-slate-200 hover:border-rose-300'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {LeftIcon && (
            <div className="w-5 h-5 rounded-lg bg-rose-100/80 text-rose-900 flex items-center justify-center flex-shrink-0">
              <LeftIcon className="w-3 h-3" />
            </div>
          )}
          
          {/* Color Indicator Dot if option has color */}
          {selectedOption?.color && (
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ring-black/10"
              style={{ backgroundColor: selectedOption.color }}
            />
          )}

          <span className="text-slate-800 truncate font-semibold">
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          {selectedOption?.count !== undefined && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-100/90 text-rose-900 font-bold flex-shrink-0">
              {selectedOption.count}
            </span>
          )}
        </div>

        <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
          isOpen ? 'bg-rose-100 text-rose-900' : 'text-slate-400 group-hover:text-rose-800'
        }`}>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-rose-900' : 'text-slate-400'
            }`}
          />
        </div>
      </button>

      {/* Floating Custom Dropdown Popup Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[220px] max-h-64 overflow-y-auto rounded-2xl bg-white border border-rose-200/90 p-1.5 shadow-2xl shadow-rose-950/15 animate-in fade-in zoom-in-95 duration-150 right-0 sm:right-auto sm:left-0 divide-y-0">
          <div className="space-y-1">
            {options.map((option) => {
              const isSelected = option.value === value;
              const OptIcon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer group ${
                    isSelected
                      ? 'bg-rose-900 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-rose-50 hover:text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 truncate">
                    {OptIcon && (
                      <OptIcon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isSelected ? 'text-white' : 'text-rose-900 group-hover:scale-110 transition-transform'
                        }`}
                      />
                    )}

                    {option.color && (
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ${
                          isSelected ? 'ring-white/50' : 'ring-black/10'
                        }`}
                        style={{ backgroundColor: option.color }}
                      />
                    )}

                    <span className="truncate">{option.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {option.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-rose-100/80 text-rose-900'
                        }`}
                      >
                        {option.count}
                      </span>
                    )}

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white flex-shrink-0 ml-1" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
