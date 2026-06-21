import { useNavigate } from '@tanstack/react-router';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { authStorage } from 'src/shared/lib/auth-storage';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';

export function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = authStorage.get();

  if (!token) {
    return (
      <Button
        data-testid='user-menu-login'
        variant='ghost'
        size='icon'
        aria-label={t('header.login')}
        onClick={() => navigate({ to: '/login', search: { redirect: undefined } })}
      >
        <User className='size-5' />
      </Button>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button data-testid='user-menu-dropdown' variant='ghost' size='icon' aria-label='User menu'>
          <User className='size-5' />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onSelect={() => navigate({ to: '/admin' })}>
          {t('admin.title')}
        </DropdownMenuItem>
        <DropdownMenuItem
          data-testid='user-menu-logout'
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
