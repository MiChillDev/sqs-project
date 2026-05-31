import { useLocation, useNavigate } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { authStorage } from 'src/shared/lib/auth-storage';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';

export function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Subscribe to route changes so the token check re-runs after navigation
  useLocation();

  const token = authStorage.get();

  if (!token) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant='ghost' size='icon' aria-label='User menu'>
          <User className='size-5' />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onSelect={() => {
            authStorage.clear();
            navigate({ to: '/login', search: { redirect: undefined } });
          }}
        >
          {t('admin.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu.Root>
  );
}
