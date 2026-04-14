/**
 * Authentication Helper Functions
 * Manages authentication state in localStorage and provides utility functions
 */

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  token?: string;
  role?: string;
}

export class AuthHelper {
  private static readonly AUTH_STORAGE_KEY = 'isAuthenticated';
  private static readonly ADMIN_USER_STORAGE_KEY = 'adminUser';
  private static readonly TOKEN_STORAGE_KEY = 'adminToken';

  /**
   * Save authentication state after successful login
   */
  static saveAuthState(user: AdminUser, token?: string): void {
    try {
      localStorage.setItem(this.AUTH_STORAGE_KEY, 'true');
      localStorage.setItem(this.ADMIN_USER_STORAGE_KEY, JSON.stringify(user));
      if (token) {
        localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
      }
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    try {
      return localStorage.getItem(this.AUTH_STORAGE_KEY) === 'true';
    } catch (error) {
      console.error('Error checking auth state:', error);
      return false;
    }
  }

  /**
   * Get currently logged-in user
   */
  static getUser(): AdminUser | null {
    try {
      const userStr = localStorage.getItem(this.ADMIN_USER_STORAGE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Get authentication token
   */
  static getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Clear authentication state (logout)
   */
  static clearAuthState(): void {
    try {
      localStorage.removeItem(this.AUTH_STORAGE_KEY);
      localStorage.removeItem(this.ADMIN_USER_STORAGE_KEY);
      localStorage.removeItem(this.TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  }

  /**
   * Set authentication from response (after login)
   */
  static setAuthFromResponse(response: any): void {
    try {
      const token = response?.token || response?.data?.token;
      const user = {
        id: response?.id || response?.data?.id || '',
        email: response?.email || response?.data?.email || '',
        name: response?.name || response?.data?.name || '',
        role: response?.role || response?.data?.role || 'admin',
        token: token,
      };

      this.saveAuthState(user, token);
    } catch (error) {
      console.error('Error setting auth from response:', error);
    }
  }
}

export default AuthHelper;
