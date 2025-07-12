// Service to handle redirect after login
export class RedirectService {
  private static REDIRECT_KEY = 'redirectAfterLogin';

  // Save the intended destination before redirecting to login
  static setRedirectPath(path: string) {
    sessionStorage.setItem(this.REDIRECT_KEY, path);
  }

  // Get the redirect path after successful login
  static getRedirectPath(): string | null {
    return sessionStorage.getItem(this.REDIRECT_KEY);
  }

  // Clear the redirect path after use
  static clearRedirectPath() {
    sessionStorage.removeItem(this.REDIRECT_KEY);
  }

  // Complete redirect logic - returns the path to navigate to
  static getPostLoginRedirect(): string {
    const redirectPath = this.getRedirectPath();
    this.clearRedirectPath();
    return redirectPath || '/'; // Default to home if no redirect path
  }
}
