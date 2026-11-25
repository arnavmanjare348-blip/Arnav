import { CSSProperties, useState } from 'react';
import { Leaf } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  style,
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFE9DD] text-[#1E3F20] p-6 text-center border border-[#D8CEBC] ${className}`}
        role="img"
        aria-label={alt}
      >
        <Leaf className="w-8 h-8 stroke-[1.5] text-[#2E5A27] mb-2" />
        <span className="font-serif text-sm font-medium text-[#1F2421]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      style={style}
      className={className}
    />
  );
}
