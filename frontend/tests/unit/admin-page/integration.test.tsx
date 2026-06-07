import './mocks';
import {
  describe,
  expect,
  it,
  mockCreateJokeMutation,
  mockSourceJokeQuery,
  renderComponent,
  screen,
  setupAdminTests,
  userEvent,
  waitFor,
} from './shared';

describe('AdminPage — integration flows', () => {
  setupAdminTests();

  describe('Full admin page rendering with sections', () => {
    it('renders all sections: heading, JokeCreationSection, SourceJokeSection', () => {
      renderComponent();

      expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();

      expect(screen.getAllByText('Create Joke').length).toBeGreaterThanOrEqual(2);
      expect(screen.getByLabelText('Content')).toBeInTheDocument();
      expect(screen.getByLabelText('External ID')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Joke' })).toBeInTheDocument();

      expect(screen.getAllByText('Fetch Source Joke').length).toBeGreaterThanOrEqual(2);
      expect(screen.getByRole('button', { name: 'Fetch Source Joke' })).toBeInTheDocument();
    });
  });

  describe('Complete create joke → success → display flow', () => {
    it('fully creates a joke and displays the result', async () => {
      const user = userEvent.setup();

      mockCreateJokeMutation.mutate.mockImplementation(
        (_vars: unknown, opts?: { onSuccess?: (data: unknown) => void }) => {
          opts?.onSuccess?.({
            id: '1',
            externalId: 'ext-1',
            content: 'Chuck Norris can divide by zero.',
          });
        }
      );

      renderComponent();

      await user.type(screen.getByLabelText('Content'), 'Chuck Norris can divide by zero.');
      await user.type(screen.getByLabelText('External ID'), 'ext-1');

      await user.click(screen.getByRole('button', { name: 'Create Joke' }));

      await waitFor(() => {
        expect(screen.getByText('Chuck Norris can divide by zero.')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('Content')).toHaveValue('');
    });
  });

  describe('Complete source joke fetch → display flow', () => {
    it('clicking fetch triggers refetch and displays the result', async () => {
      const user = userEvent.setup();
      const joke = 'Chuck Norris uses ribbed lightbulbs.';

      // Pre-set the query state to simulate a previously successful fetch
      mockSourceJokeQuery.data = { content: joke };
      mockSourceJokeQuery.isFetching = false;
      mockSourceJokeQuery.refetch.mockResolvedValue({
        data: { content: joke },
        error: null,
      });

      renderComponent();

      // Content already displayed from the pre-set state
      expect(screen.getByText(joke)).toBeInTheDocument();

      // Clicking refetch triggers the hook
      await user.click(screen.getByRole('button', { name: 'Fetch Source Joke' }));
      expect(mockSourceJokeQuery.refetch).toHaveBeenCalledOnce();
    });
  });
});
