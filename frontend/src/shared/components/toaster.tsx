import { Toaster as SonnerToaster } from 'sonner';

import { useTheme } from 'src/shared/hooks/use-theme';

const toastClassNames = {
  toast: 'relative flex items-start gap-3 border shadow-lg rounded-xl p-4 w-full',
  default: 'bg-popover text-popover-foreground border-border',
  success: '',
  error: '',
  info: '',
  warning: '',
  title: 'text-sm font-semibold',
  description: 'text-sm opacity-80 mt-1',
  content: 'flex-1',
  icon: 'shrink-0 [&>svg]:size-5',
  closeButton:
    'absolute right-2 top-2 rounded-md p-0.5 text-muted-foreground/50 hover:text-foreground transition-colors',
  actionButton:
    'bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors',
  cancelButton:
    'bg-secondary text-secondary-foreground rounded-md px-3 py-1.5 text-sm font-medium hover:bg-secondary/80 transition-colors',
} as const;

export function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      position='top-right'
      closeButton
      theme={theme}
      toastOptions={{ unstyled: true, classNames: toastClassNames }}
    />
  );
}
