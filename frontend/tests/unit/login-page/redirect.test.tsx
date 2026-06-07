import './mocks';
import {
  describe,
  expect,
  it,
  loginAndExpectRedirect,
  mockAuthStorageGet,
  mockNavigate,
  mockUseSearch,
  renderComponent,
  setupLoginTests,
  waitFor,
} from './shared';

describe('LoginPage — redirect search parameter', () => {
  setupLoginTests();

  it('redirects to /admin by default (no redirect param)', async () => {
    await loginAndExpectRedirect(undefined, '/admin');
  });

  it('redirects to the path specified in the redirect search param', async () => {
    await loginAndExpectRedirect('/jokes', '/jokes');
  });

  it('already-authenticated bounce uses redirect search param', async () => {
    mockAuthStorageGet.mockReturnValue({
      token: 'tok',
      expiresAt: '2099-06-25T10:30:00',
    });
    mockUseSearch('/admin');

    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin' });
    });
  });

  it('blocks external URL in redirect param (open redirect prevention)', async () => {
    await loginAndExpectRedirect('https://evil.com', '/admin');
  });

  it('blocks protocol-relative URL in redirect param', async () => {
    await loginAndExpectRedirect('//evil.com/path', '/admin');
  });

  it('blocks non-absolute path in redirect param', async () => {
    await loginAndExpectRedirect('evil/path', '/admin');
  });

  it('honors the /admin redirect param on successful login', async () => {
    await loginAndExpectRedirect('/admin', '/admin');
  });
});
