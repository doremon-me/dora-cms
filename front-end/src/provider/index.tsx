import { QueryProvider } from "./query.provider";
import { ThemeProvider } from "./theme.provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
