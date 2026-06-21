import './mocks';
import {
  adminRoute,
  describe,
  expect,
  it,
  renderComponent,
  screen,
  setupAdminTests,
  userEvent,
} from './shared';

describe('AdminPage', () => {
  setupAdminTests();

  it('route /admin is defined and has beforeLoad set', () => {
    expect(adminRoute.options.beforeLoad).toBeDefined();
  });

  it('page layout uses max-w-200 p-8 class', () => {
    const { container } = renderComponent();
    const wrapperDiv = container.firstElementChild;
    expect(wrapperDiv).toHaveClass('min-h-screen');
    const innerDiv = wrapperDiv?.firstElementChild;
    expect(innerDiv).toHaveClass('max-w-200');
    expect(innerDiv).toHaveClass('p-8');
  });

  it('renders tab triggers and shows active tab content', async () => {
    const user = userEvent.setup();
    renderComponent();

    expect(screen.getByRole('tab', { name: 'Fetch and save' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Create' })).toBeInTheDocument();

    // Source tab is active by default — Fetch Source Joke section is visible
    expect(screen.getAllByText('Fetch Source Joke').length).toBeGreaterThanOrEqual(1);

    // Switch to Create tab
    await user.click(screen.getByRole('tab', { name: 'Create' }));

    // Create Joke section is now visible
    expect(screen.getAllByText('Create Joke').length).toBeGreaterThanOrEqual(2);
  });
});
