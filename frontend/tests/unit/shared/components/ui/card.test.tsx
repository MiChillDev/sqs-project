import { render, screen } from '@testing-library/react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/shared/components/ui/card';
import { describe, expect, it } from 'vitest';

describe('Card', () => {
  it('renders with data-slot and children', () => {
    const { container } = render(<Card>Card content</Card>);
    const el = container.querySelector('[data-slot="card"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Card content');
  });

  it('applies custom className', () => {
    render(<Card className='extra'>Content</Card>);
    expect(screen.getByText('Content').closest('[data-slot="card"]')).toHaveClass('extra');
  });
});

describe('CardHeader', () => {
  it('renders with data-slot and children', () => {
    const { container } = render(<CardHeader>Header content</CardHeader>);
    const el = container.querySelector('[data-slot="card-header"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Header content');
  });

  it('applies custom className', () => {
    render(<CardHeader className='extra'>Header</CardHeader>);
    expect(screen.getByText('Header').closest('[data-slot="card-header"]')).toHaveClass('extra');
  });
});

describe('CardTitle', () => {
  it('renders with data-slot and children', () => {
    const { container } = render(<CardTitle>Card Title</CardTitle>);
    const el = container.querySelector('[data-slot="card-title"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Card Title');
  });

  it('applies custom className', () => {
    render(<CardTitle className='extra'>Title</CardTitle>);
    expect(screen.getByText('Title').closest('[data-slot="card-title"]')).toHaveClass('extra');
  });
});

describe('CardDescription', () => {
  it('renders with data-slot and children', () => {
    const { container } = render(<CardDescription>A description</CardDescription>);
    const el = container.querySelector('[data-slot="card-description"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('A description');
  });

  it('applies custom className', () => {
    render(<CardDescription className='extra'>Desc</CardDescription>);
    expect(screen.getByText('Desc').closest('[data-slot="card-description"]')).toHaveClass('extra');
  });
});

describe('CardAction', () => {
  it('renders with data-slot and children', () => {
    const { container } = render(<CardAction>Action</CardAction>);
    const el = container.querySelector('[data-slot="card-action"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Action');
  });

  it('applies custom className', () => {
    render(<CardAction className='extra'>Action</CardAction>);
    expect(screen.getByText('Action').closest('[data-slot="card-action"]')).toHaveClass('extra');
  });
});

describe('CardContent', () => {
  it('renders with data-slot and children', () => {
    const { container } = render(<CardContent>Body content</CardContent>);
    const el = container.querySelector('[data-slot="card-content"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Body content');
  });

  it('applies custom className', () => {
    render(<CardContent className='extra'>Body</CardContent>);
    expect(screen.getByText('Body').closest('[data-slot="card-content"]')).toHaveClass('extra');
  });
});

describe('CardFooter', () => {
  it('renders with data-slot and children', () => {
    const { container } = render(<CardFooter>Footer content</CardFooter>);
    const el = container.querySelector('[data-slot="card-footer"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Footer content');
  });

  it('applies custom className', () => {
    render(<CardFooter className='extra'>Footer</CardFooter>);
    expect(screen.getByText('Footer').closest('[data-slot="card-footer"]')).toHaveClass('extra');
  });
});
