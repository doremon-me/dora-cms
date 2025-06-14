import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Icon from "@/lib/icons";
import toast from "react-hot-toast";

interface ConfirmDialogProps {
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string | React.ReactNode;
  variant?: "default" | "destructive" | "warning";
  icon?: string;
  cancelText?: string;
  confirmText?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export const ConfirmDialog = ({
  onConfirm,
  title,
  description,
  variant = "default",
  icon,
  cancelText = "Cancel",
  confirmText = "Confirm",
  loading = false,
  children,
}: ConfirmDialogProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      toast.error("Confirmation action failed:");
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          iconColor: "text-red-500",
          iconBg: "bg-red-50 dark:bg-red-950/20",
          confirmButton: "destructive" as const,
        };
      case "warning":
        return {
          iconColor: "text-yellow-500",
          iconBg: "bg-yellow-50 dark:bg-yellow-950/20",
          confirmButton: "default" as const,
        };
      default:
        return {
          iconColor: "text-blue-500",
          iconBg: "bg-blue-50 dark:bg-blue-950/20",
          confirmButton: "default" as const,
        };
    }
  };

  const getDefaultIcon = () => {
    switch (variant) {
      case "destructive":
        return "Trash2";
      case "warning":
        return "AlertTriangle";
      default:
        return "HelpCircle";
    }
  };

  const variantStyles = getVariantStyles();
  const iconName = icon || getDefaultIcon();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className={`p-3 rounded-full ${variantStyles.iconBg}`}>
              <Icon
                //   @ts-ignore
                name={iconName}
                size={24}
                className={variantStyles.iconColor}
              />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-semibold">
                {title || "Are you sure?"}
              </AlertDialogTitle>
            </div>
          </div>

          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {description ||
              "This action cannot be undone. Please confirm to proceed."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={`${
              variantStyles.confirmButton === "destructive"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : ""
            }`}
          >
            {loading && (
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
            )}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
