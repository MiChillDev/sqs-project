import { render, screen } from '@testing-library/react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'src/shared/components/ui/sheet';
import { describe, expect, it } from 'vitest';

describe('Sheet', () => {
  it('renders children within dialog context', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Test Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});

describe('SheetTrigger', () => {
  it('renders with data-slot inside Sheet context', () => {
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
      </Sheet>
    );
    const el = document.querySelector('[data-slot="sheet-trigger"]');
    expect(el).toBeInTheDocument();
  });
});

describe('SheetClose', () => {
  it('renders with data-slot inside Sheet context', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetClose />
        </SheetContent>
      </Sheet>
    );
    const el = document.querySelector('[data-slot="sheet-close"]');
    expect(el).toBeInTheDocument();
  });
});

describe('SheetOverlay', () => {
  it('renders with data-slot when Sheet is open', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const el = document.querySelector('[data-slot="sheet-overlay"]');
    expect(el).toBeInTheDocument();
  });
});

describe('SheetContent', () => {
  it('renders children and close button by default', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Sheet body</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByText('Sheet body')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(
      <Sheet open>
        <SheetContent showCloseButton={false}>
          <SheetTitle>Body</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Sheet open>
        <SheetContent className='custom-sheet'>
          <SheetTitle>Body</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(document.querySelector('[data-slot="sheet-content"]')).toHaveClass('custom-sheet');
  });

  it('renders with left side classes', () => {
    render(
      <Sheet open>
        <SheetContent side='left'>
          <SheetTitle>Body</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const content = document.querySelector('[data-slot="sheet-content"]');
    expect(content).toBeInTheDocument();
    expect(content?.className).toContain('inset-y-0');
    expect(content?.className).toContain('left-0');
  });

  it('renders with top side classes', () => {
    render(
      <Sheet open>
        <SheetContent side='top'>
          <SheetTitle>Body</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const content = document.querySelector('[data-slot="sheet-content"]');
    expect(content?.className).toContain('inset-x-0');
    expect(content?.className).toContain('top-0');
  });

  it('renders with bottom side classes', () => {
    render(
      <Sheet open>
        <SheetContent side='bottom'>
          <SheetTitle>Body</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const content = document.querySelector('[data-slot="sheet-content"]');
    expect(content?.className).toContain('inset-x-0');
    expect(content?.className).toContain('bottom-0');
  });
});

describe('SheetHeader', () => {
  it('renders with data-slot attribute', () => {
    const { container } = render(<SheetHeader>Header</SheetHeader>);
    const el = container.querySelector('[data-slot="sheet-header"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Header');
  });

  it('applies custom className', () => {
    render(<SheetHeader className='extra'>Header</SheetHeader>);
    expect(screen.getByText('Header').closest('[data-slot="sheet-header"]')).toHaveClass('extra');
  });
});

describe('SheetFooter', () => {
  it('renders with data-slot attribute', () => {
    const { container } = render(<SheetFooter>Footer</SheetFooter>);
    const el = container.querySelector('[data-slot="sheet-footer"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Footer');
  });

  it('applies custom className', () => {
    render(<SheetFooter className='extra'>Footer</SheetFooter>);
    expect(screen.getByText('Footer').closest('[data-slot="sheet-footer"]')).toHaveClass('extra');
  });
});

describe('SheetTitle', () => {
  it('renders with data-slot attribute', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>My Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    const el = document.querySelector('[data-slot="sheet-title"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('My Title');
  });

  it('applies custom className', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle className='extra'>Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByText('Title')).toHaveClass('extra');
  });
});

describe('SheetDescription', () => {
  it('renders with data-slot attribute', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription>Description text</SheetDescription>
        </SheetContent>
      </Sheet>
    );
    const el = document.querySelector('[data-slot="sheet-description"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Description text');
  });

  it('applies custom className', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription className='extra'>Desc</SheetDescription>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByText('Desc')).toHaveClass('extra');
  });
});
