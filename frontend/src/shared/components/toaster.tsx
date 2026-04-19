import { Toaster as SonnerToaster } from 'sonner';

import { useTheme } from '@/shared/hooks/use-theme';

const toastClassNames = {
  toast: 'relative flex items-start gap-3 border shadow-lg rounded-xl p-4 w-full',
  default: 'bg-popover text-popover-foreground border-border',
  success:
    'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100',
  error:
    'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
  info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
  warning:
    'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100',
  title: 'text-sm font-semibold',
  description: 'text-sm text-muted-foreground mt-1',
  content: 'flex-1',
  icon: 'shrink-0 [&>svg]:size-5',
  closeButton: 'absolute right-2 top-2 rounded-md p-0.5 text-muted-foreground/50 hover:text-foreground transition-colors',
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
