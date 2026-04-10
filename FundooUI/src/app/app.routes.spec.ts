import { routes } from './app.routes';

describe('app routes', () => {
  it('should redirect the empty path to login', () => {
    expect(routes[0]?.path).toBe('');
    expect(routes[0]?.redirectTo).toBe('login');
  });

  it('should protect the home route with the auth guard and child routes', () => {
    const homeRoute = routes.find((route) => route.path === 'home');

    expect(homeRoute?.canActivate?.length).toBe(1);
    expect(homeRoute?.children?.some((route) => route.path === 'notes')).toBe(true);
    expect(homeRoute?.children?.some((route) => route.path === 'archive')).toBe(true);
    expect(homeRoute?.children?.some((route) => route.path === 'trash')).toBe(true);
    expect(homeRoute?.children?.some((route) => route.path === 'reminders')).toBe(true);
    expect(homeRoute?.children?.some((route) => route.path === 'labels/manage')).toBe(true);
    expect(homeRoute?.children?.some((route) => route.path === 'labels/:labelId')).toBe(true);
    expect(homeRoute?.children?.some((route) => route.path === 'invitations')).toBe(true);
    expect(homeRoute?.children?.some((route) => route.path === 'sessions')).toBe(true);
  });

  it('should expose the remaining auth routes', () => {
    expect(routes.some((route) => route.path === 'forgot-password')).toBe(true);
    expect(routes.some((route) => route.path === 'reset-password')).toBe(true);
    expect(routes.some((route) => route.path === 'verify-email')).toBe(true);
    expect(routes.some((route) => route.path === 'resend-verification')).toBe(true);
    expect(routes.some((route) => route.path === 'change-password')).toBe(true);
  });
});
