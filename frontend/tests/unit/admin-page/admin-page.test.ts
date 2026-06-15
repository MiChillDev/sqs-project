import './mocks';
import {
  adminRoute,
  describe,
  expect,
  it,
  renderComponent,
  screen,
  setupAdminTests,
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

  it('renders section headings for Create Joke and Fetch Source Joke', () => {
    renderComponent();
    expect(screen.getAllByText('Create Joke').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Fetch Source Joke').length).toBeGreaterThanOrEqual(2);
  });
});
