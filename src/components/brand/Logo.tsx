import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "mark" | "wordmark";
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  asLink?: boolean;
  withTagline?: boolean;
  /** Optional click handler — used for hidden admin tap-to-unlock */
  onLogoClick?: (e: React.MouseEvent) => void;
}

const sizeClasses = {
  full: {
    sm: "h-8 w-auto",
    md: "h-12 w-auto",
    lg: "h-16 w-auto",
    xl: "h-24 w-auto",
  },
  mark: {
    sm: "h-6 w-auto",
    md: "h-9 w-auto",
    lg: "h-12 w-auto",
    xl: "h-16 w-auto",
  },
  wordmark: {
    sm: "h-5 w-auto",
    md: "h-8 w-auto",
    lg: "h-11 w-auto",
    xl: "h-14 w-auto",
  },
};

export function Logo({
  variant = "full",
  theme = "dark",
  size = "md",
  className,
  asLink = true,
  withTagline = false,
  onLogoClick,
}: LogoProps) {
  // Select appropriate SVG file based on variant and theme (light = for dark bg, dark = for light bg)
  let src = "/brand/logo-transparent-dark.svg";

  if (theme === "light") {
    // Light blush fills for dark oxblood background
    if (variant === "mark") src = "/brand/logo-peacock.png";
    else if (variant === "wordmark") src = "/brand/logo-wordmark.png";
    else src = "/brand/logo-full-light.png";
  } else {
    // Oxblood fills for light cream/white background
    if (variant === "mark") src = "/brand/logo-peacock-dark.png";
    else if (variant === "wordmark") src = "/brand/logo-wordmark-dark.png";
    else src = "/brand/logo-full-dark.png";
  }

  const content = (
    <div className={cn("inline-flex flex-col items-center justify-center select-none", className)}>
      <img
        src={src}
        alt="Albeli — Not so ordinary."
        className={cn("object-contain transition-opacity duration-300", sizeClasses[variant][size])}
        loading="eager"
      />
      {withTagline && (
        <span
          className={cn(
            "text-[10px] tracking-[0.25em] uppercase font-sans mt-1.5 transition-colors",
            theme === "light" ? "text-blush/80" : "text-oxblood/80"
          )}
        >
          Not so ordinary.
        </span>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        onClick={onLogoClick}
        className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/50 rounded-sm"
        aria-label="Albeli Home"
      >
        {content}
      </Link>
    );
  }

  if (onLogoClick) {
    return (
      <button
        type="button"
        onClick={onLogoClick}
        className="inline-flex items-center cursor-pointer focus-visible:outline-none"
        aria-label="Albeli"
      >
        {content}
      </button>
    );
  }

  return content;
}
