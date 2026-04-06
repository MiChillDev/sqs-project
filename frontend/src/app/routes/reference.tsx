import { zodResolver } from '@hookform/resolvers/zod';
import { createRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { ThemeToggle } from '@/shared/components/theme-toggle';
import { Button } from '@/shared/components/ui/button';
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { useTheme } from '@/shared/hooks/use-theme';

import { rootRoute } from './__root';

export const contactSchema = z.object({
  name: z.string().min(2, { error: 'Name must be at least 2 characters' }),
  email: z.email({ error: 'Please enter a valid email address' }),
});
type ContactForm = z.infer<typeof contactSchema>;

const referenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reference',
  component: function ReferencePage() {
    const { theme, toggleTheme } = useTheme();

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<ContactForm>({
      resolver: zodResolver(contactSchema),
      defaultValues: { name: '', email: '' },
      mode: 'onTouched',
    });

    function onSubmit(data: ContactForm) {
      toast.success('Form submitted', { description: `Thank you, ${data.name}!` });
      reset();
    }

    return (
      <div className='mx-auto max-w-400 p-8'>
        <h2 className='text-2xl font-bold'>Reference Implementation</h2>
        <div className='mt-4 flex gap-2'>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              toast.error('Simulated error', { description: 'This is a simulated API error' })
            }
          >
            Simulate Error
          </Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-6 space-y-4'>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor='name'>Name</FieldLabel>
            <FieldContent>
              <Input
                id='name'
                aria-invalid={!!errors.name}
                {...register('name')}
                placeholder='Enter your name'
              />
            </FieldContent>
            <FieldError errors={[errors.name]} />
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor='email'>Email</FieldLabel>
            <FieldContent>
              <Input
                id='email'
                type='email'
                aria-invalid={!!errors.email}
                {...register('email')}
                placeholder='Enter your email'
              />
            </FieldContent>
            <FieldError errors={[errors.email]} />
          </Field>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </div>
    );
  },
});

export default referenceRoute;
