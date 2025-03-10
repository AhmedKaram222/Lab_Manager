import React from "react";

interface FormattedTextProps {
  content: string;
  className?: string;
}

const FormattedText = ({ content, className = "" }: FormattedTextProps) => {
  // تحويل النص المنسق إلى HTML
  const createMarkup = () => {
    return { __html: content };
  };

  return <div className={className} dangerouslySetInnerHTML={createMarkup()} />;
};

export default FormattedText;
