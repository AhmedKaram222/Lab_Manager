import React, { useState } from "react";
import { Button } from "./button";
import { Bold, Italic, Underline, Type } from "lucide-react";

interface TextFormatterProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

const TextFormatter = ({
  value,
  onChange,
  rows = 3,
  placeholder = "",
}: TextFormatterProps) => {
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(
    null,
  );

  const handleTextareaRef = (ref: HTMLTextAreaElement) => {
    setTextareaRef(ref);
  };

  const handleSelect = () => {
    if (textareaRef) {
      setSelection({
        start: textareaRef.selectionStart,
        end: textareaRef.selectionEnd,
      });
    }
  };

  const applyFormat = (format: string) => {
    if (!textareaRef || !selection) return;

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
        if (textareaRef) {
          textareaRef.focus();
          textareaRef.setSelectionRange(start, start + formattedText.length);
          setSelection({
            start,
            end: start + formattedText.length,
          });
        }
      }, 0);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => applyFormat("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => applyFormat("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => applyFormat("underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => applyFormat("red")}
          title="Red Text"
          className="text-red-600"
        >
          <Type className="h-4 w-4" />
        </Button>
      </div>
      <textarea
        ref={handleTextareaRef}
        className="w-full min-h-[80px] p-2 border rounded-md resize-y"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextFormatter;
