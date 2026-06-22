import { render, screen } from '@testing-library/react';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from 'src/shared/components/ui/field';
import { describe, expect, it } from 'vitest';

describe('FieldTitle', () => {
  it('renders with data-slot attribute and children', () => {
    render(<FieldTitle>My Title</FieldTitle>);
    const el = screen.getByText('My Title');
    expect(el).toHaveAttribute('data-slot', 'field-title');
  });

  it('applies custom className', () => {
    render(<FieldTitle className='extra'>Title</FieldTitle>);
    expect(screen.getByText('Title')).toHaveClass('extra');
  });

  it('passes through additional props', () => {
    render(<FieldTitle id='title-id'>Title</FieldTitle>);
    expect(screen.getByText('Title')).toHaveAttribute('id', 'title-id');
  });
});

describe('FieldDescription', () => {
  it('renders as a p element with data-slot attribute', () => {
    render(<FieldDescription>A helpful description</FieldDescription>);
    const el = screen.getByText('A helpful description');
    expect(el.tagName).toBe('P');
    expect(el).toHaveAttribute('data-slot', 'field-description');
  });

  it('applies custom className', () => {
    render(<FieldDescription className='extra'>Desc</FieldDescription>);
    expect(screen.getByText('Desc')).toHaveClass('extra');
  });
});

describe('FieldError', () => {
  it('renders children when children prop is provided (bypasses errors array)', () => {
    render(<FieldError>Custom inline error</FieldError>);
    expect(screen.getByRole('alert')).toHaveTextContent('Custom inline error');
  });

  it('returns null for an empty errors array', () => {
    const { container } = render(<FieldError errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('returns null when errors is undefined and no children', () => {
    const { container } = render(<FieldError />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a single error message', () => {
    render(<FieldError errors={[{ message: 'This field is required' }]} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('This field is required');
    expect(document.querySelector('ul')).toBeNull();
  });

  it('renders a list for multiple errors', () => {
    render(<FieldError errors={[{ message: 'Error A' }, { message: 'Error B' }]} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error A')).toBeInTheDocument();
    expect(screen.getByText('Error B')).toBeInTheDocument();
    expect(document.querySelector('ul')).toBeInTheDocument();
    expect(document.querySelectorAll('li').length).toBe(2);
  });

  it('deduplicates error messages', () => {
    render(
      <FieldError errors={[{ message: 'Same' }, { message: 'Same' }, { message: 'Other' }]} />
    );
    const items = document.querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(screen.getByText('Same')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('filters out undefined and null entries from errors', () => {
    render(
      <FieldError errors={[undefined, { message: 'Valid' }, undefined, { message: undefined }]} />
    );
    expect(screen.getByText('Valid')).toBeInTheDocument();
    expect(screen.queryByText('undefined')).toBeNull();
  });

  it('applies className to the alert element', () => {
    render(<FieldError errors={[{ message: 'error' }]} className='custom-class' />);
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });
});

describe('FieldSet', () => {
  it('renders as fieldset with data-slot attribute', () => {
    const { container } = render(<FieldSet>Fields</FieldSet>);
    const el = container.querySelector('[data-slot="field-set"]');
    expect(el).toBeInTheDocument();
    expect(el?.tagName).toBe('FIELDSET');
    expect(el).toHaveTextContent('Fields');
  });

  it('applies custom className', () => {
    render(<FieldSet className='extra'>Fields</FieldSet>);
    expect(screen.getByText('Fields').closest('fieldset')).toHaveClass('extra');
  });
});

describe('FieldLegend', () => {
  it('renders as legend with data-slot and data-variant', () => {
    const { container } = render(<FieldLegend>My Legend</FieldLegend>);
    const el = container.querySelector('[data-slot="field-legend"]');
    expect(el).toBeInTheDocument();
    expect(el?.tagName).toBe('LEGEND');
    expect(el).toHaveTextContent('My Legend');
    expect(el).toHaveAttribute('data-variant', 'legend');
  });

  it('renders with label variant', () => {
    const { container } = render(<FieldLegend variant='label'>Label</FieldLegend>);
    expect(container.querySelector('[data-slot="field-legend"]')).toHaveAttribute(
      'data-variant',
      'label'
    );
  });

  it('applies custom className', () => {
    render(<FieldLegend className='extra'>Legend</FieldLegend>);
    expect(screen.getByText('Legend').closest('legend')).toHaveClass('extra');
  });
});

describe('FieldGroup', () => {
  it('renders with data-slot attribute', () => {
    const { container } = render(<FieldGroup>Group</FieldGroup>);
    const el = container.querySelector('[data-slot="field-group"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Group');
  });

  it('applies custom className', () => {
    render(<FieldGroup className='extra'>Group</FieldGroup>);
    expect(screen.getByText('Group').closest('[data-slot="field-group"]')).toHaveClass('extra');
  });
});

describe('Field', () => {
  it('renders as fieldset with data-slot attribute', () => {
    const { container } = render(<Field>Field content</Field>);
    const el = container.querySelector('[data-slot="field"]');
    expect(el).toBeInTheDocument();
    expect(el?.tagName).toBe('FIELDSET');
    expect(el).toHaveTextContent('Field content');
  });

  it('defaults to vertical orientation', () => {
    const { container } = render(<Field>Content</Field>);
    expect(container.querySelector('[data-slot="field"]')).toHaveAttribute(
      'data-orientation',
      'vertical'
    );
  });

  it('renders with horizontal orientation', () => {
    const { container } = render(<Field orientation='horizontal'>Content</Field>);
    expect(container.querySelector('[data-slot="field"]')).toHaveAttribute(
      'data-orientation',
      'horizontal'
    );
  });

  it('renders with responsive orientation', () => {
    const { container } = render(<Field orientation='responsive'>Content</Field>);
    expect(container.querySelector('[data-slot="field"]')).toHaveAttribute(
      'data-orientation',
      'responsive'
    );
  });

  it('sets aria-label and aria-labelledby', () => {
    const { container } = render(
      <Field aria-label='Field label' aria-labelledby='other-id'>
        Content
      </Field>
    );
    const el = container.querySelector('[data-slot="field"]');
    expect(el).toHaveAttribute('aria-label', 'Field label');
    expect(el).toHaveAttribute('aria-labelledby', 'other-id');
  });

  it('applies custom className', () => {
    render(<Field className='extra'>Content</Field>);
    expect(screen.getByText('Content').closest('[data-slot="field"]')).toHaveClass('extra');
  });
});

describe('FieldContent', () => {
  it('renders with data-slot attribute', () => {
    const { container } = render(<FieldContent>Content</FieldContent>);
    const el = container.querySelector('[data-slot="field-content"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Content');
  });

  it('applies custom className', () => {
    render(<FieldContent className='extra'>Content</FieldContent>);
    expect(screen.getByText('Content').closest('[data-slot="field-content"]')).toHaveClass('extra');
  });
});

describe('FieldLabel', () => {
  it('renders with data-slot attribute', () => {
    const { container } = render(<FieldLabel>My Label</FieldLabel>);
    const el = container.querySelector('[data-slot="field-label"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('My Label');
  });

  it('applies custom className', () => {
    render(<FieldLabel className='extra'>Label</FieldLabel>);
    expect(screen.getByText('Label').closest('[data-slot="field-label"]')).toHaveClass('extra');
  });
});

describe('FieldSeparator', () => {
  it('renders without children', () => {
    const { container } = render(<FieldSeparator />);
    const el = container.querySelector('[data-slot="field-separator"]');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('data-content', 'false');
  });

  it('renders content span when children provided', () => {
    render(<FieldSeparator>or</FieldSeparator>);
    expect(screen.getByText('or')).toBeInTheDocument();
    const content = document.querySelector('[data-slot="field-separator-content"]');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('or');
  });
});
