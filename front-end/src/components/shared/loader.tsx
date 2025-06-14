import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Shield } from "lucide-react";

interface LoaderProps {
  variant?: "fullscreen" | "inline";
  size?: "sm" | "md" | "lg";
  showTrustBadge?: boolean;
  message?: string;
  animation?: "spin" | "pulse" | "bounce" | "dots";
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  variant = "fullscreen",
  size = "md",
  showTrustBadge = false,
  message,
  animation = "spin",
  className,
}) => {
  const sizeMap = {
    sm: { icon: 16, text: "text-sm" },
    md: { icon: 24, text: "text-base" },
    lg: { icon: 32, text: "text-lg" },
  };

  const sizes = sizeMap[size];

  const LoadingAnimation = () => {
    switch (animation) {
      case "spin":
        return (
          <Loader2 
            className={cn("animate-spin", `w-${sizes.icon/4} h-${sizes.icon/4}`)}
            style={{ width: sizes.icon, height: sizes.icon }}
          />
        );
      
      case "pulse":
        return (
          <div 
            className="bg-primary rounded-full animate-pulse"
            style={{ width: sizes.icon, height: sizes.icon }}
          />
        );
      
      case "bounce":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-primary rounded-full animate-bounce",
                  `w-${Math.max(2, sizes.icon/8)} h-${Math.max(2, sizes.icon/8)}`
                )}
                style={{ 
                  width: Math.max(8, sizes.icon/3), 
                  height: Math.max(8, sizes.icon/3),
                  animationDelay: `${i * 0.1}s` 
                }}
              />
            ))}
          </div>
        );
      
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      
      default:
        return (
          <Loader2 
            className="animate-spin text-primary"
            style={{ width: sizes.icon, height: sizes.icon }}
          />
        );
    }
  };

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <LoadingAnimation />
        {message && (
          <span className={cn("text-muted-foreground", sizes.text)}>
            {message}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 text-center">
        <LoadingAnimation />
        
        {message && (
          <p className={cn("text-muted-foreground max-w-sm", sizes.text)}>
            {message}
          </p>
        )}

        {showTrustBadge && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span className="text-xs">Secure Connection</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;