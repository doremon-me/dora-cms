import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Icon from "./icon";
import { Link } from "react-router-dom";

interface NotFoundProps {
  variant?: "fullscreen" | "inline";
  size?: "sm" | "md" | "lg" | "xl";
  title?: string;
  message?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
  icon?: "FileX" | "Search" | "AlertTriangle" | "Frown" | "ShieldAlert";
}

const NotFound: React.FC<NotFoundProps> = ({
  variant = "fullscreen",
  size = variant === "fullscreen" ? "lg" : "md",
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  showBackButton = true,
  onBack,
  className,
  icon = "FileX",
}) => {
  const sizeMap = {
    sm: { icon: 24, title: "text-lg", message: "text-sm" },
    md: { icon: 48, title: "text-xl", message: "text-base" },
    lg: { icon: 72, title: "text-2xl", message: "text-lg" },
    xl: { icon: 96, title: "text-3xl", message: "text-xl" },
  };

  const sizes = sizeMap[size];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-4 p-6 text-center",
          className
        )}
      >
        <div className="text-muted-foreground">
          <Icon name={icon} size={sizes.icon} />
        </div>
        <div className="space-y-2">
          <h3 className={cn("font-semibold text-foreground", sizes.title)}>
            {title}
          </h3>
          <p className={cn("text-muted-foreground", sizes.message)}>
            {message}
          </p>
        </div>
        {showBackButton && (
          <Button variant="outline" onClick={handleBack} className="mt-2">
            Go Back
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="text-muted-foreground">
          <Icon name={icon} size={sizes.icon} />
        </div>

        <div className="space-y-3">
          <h1 className={cn("font-bold text-foreground", sizes.title)}>
            {title}
          </h1>
          <p className={cn("text-muted-foreground", sizes.message)}>
            {message}
          </p>
        </div>

        {showBackButton && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack}>
              Go Back
            </Button>
            <Button>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
