import React, { useState, useRef } from "react";
import { Input, InputProps } from "./input";
import { Button } from "./button";
import { Bold, Italic, Underline, Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormattedInputProps extends Omit<InputProps, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isOutOfRange?: boolean;
}

const FormattedInput = ({
  value,
  onChange,
  className,
  isOutOfRange = false,
  ...props
}: FormattedInputProps) => {
  const [showFormatting, setShowFormatting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const handleSelect = () => {
    if (inputRef.current) {
      setSelection({
        start: inputRef.current.selectionStart || 0,
        end: inputRef.current.selectionEnd || 0,
      });
    }
  };

  const applyFormat = (format: string) => {
    if (!inputRef.current || !selection) return;

    const { start, end } = selection;
    const selectedText = value.substring(start, end);

    if (selectedText) {
      let newText = value;
      let formattedText = "";

      switch (format) {
        case "bold":
          formattedText = `<b>${selectedText}</b>`;
          break;
        case "italic":
          formattedText = `<i>${selectedText}</i>`;
          break;
        case "underline":
          formattedText = `<u>${selectedText}</u>`;
          break;
        case "red":
          formattedText = `<span class="text-red-600">${selectedText}</span>`;
          break;
        default:
          formattedText = selectedText;
      }

      newText =
        value.substring(0, start) + formattedText + value.substring(end);
      onChange(newText);

      // Reset selection after applying format
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(
            start,
            start + formattedText.length,
          );
          setSelection({
            start,
            end: start + formattedText.length,
          });
        }
      }, 0);
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        onFocus={() => setShowFormatting(true)}
        onBlur={() => setTimeout(() => setShowFormatting(false), 200)}
        className={cn(
          "text-center h-8 p-1",
          isOutOfRange ? "font-bold text-red-600" : "",
          className,
        )}
        {...props}
      />
      {showFormatting && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-md z-10 flex p-1 gap-1 no-print">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => applyFormat("bold")}
            title="Bold"
            className="h-6 w-6"
          >
            <Bold className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => applyFormat("italic")}
            title="Italic"
            className="h-6 w-6"
          >
            <Italic className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => applyFormat("underline")}
            title="Underline"
            className="h-6 w-6"
          >
            <Underline className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => applyFormat("red")}
            title="Red Text"
            className="h-6 w-6 text-red-600"
          >
            <Type className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormattedInput;
