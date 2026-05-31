import {
  adminRoute,
  afterEach,
  beforeEach,
  cleanup,
  describe,
  expect,
  it,
  renderComponent,
  resetMocks,
  screen,
} from './shared';

describe('AdminPage', () => {
  beforeEach(resetMocks);
  afterEach(cleanup);

  it('route /admin is defined and has beforeLoad set', () => {
    expect(adminRoute.options.beforeLoad).toBeDefined();
  });

  it('renders "Admin" heading', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();
  });

  it('page layout uses max-w-200 p-8 class', () => {
    const { container } = renderComponent();
    const rootDiv = container.firstElementChild;
    expect(rootDiv).toHaveClass('max-w-200');
    expect(rootDiv).toHaveClass('p-8');
  });

  it('renders section headings for Create Joke and Fetch Source Joke', () => {
    renderComponent();
    expect(screen.getAllByText('Create Joke').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Fetch Source Joke').length).toBeGreaterThanOrEqual(2);
  });
});
