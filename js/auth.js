/**
 * CRIME REPORTING SYSTEM (CRS) - FRONTEND AUTHENTICATION MODULE
 * Handles sessions, role validation, redirects, and logout.
 * Note: Pure frontend session management prepared for server-side PHP JWT/session integration.
 */

const AuthService = {
  SESSION_KEY: 'crs_current_session',

  /**
   * Get active logged-in user or null
   */
  getCurrentUser() {
    try {
      const session = localStorage.getItem(this.SESSION_KEY);
      if (!session) return null;
      return JSON.parse(session);
    } catch (e) {
      console.error('Error reading auth session:', e);
      return null;
    }
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Register Citizen User
   */
  async registerUser(userData) {
    const response = await ApiService.apiRegister(userData);
    return response;
  },

  /**
   * Citizen Login
   */
  async loginUser(identifier, password, remember = false) {
    const result = await ApiService.apiLogin(identifier, password);
    if (result.success) {
      this.setSession(result.user);
    }
    return result;
  },

  /**
   * Police / Official Login
   */
  async loginPolice(policeId, stationCode, password) {
    const result = await ApiService.apiPoliceLogin(policeId, stationCode, password);
    if (result.success) {
      this.setSession(result.user);
    }
    return result;
  },

  /**
   * Set user session in LocalStorage
   */
  setSession(user) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify({
      ...user,
      loginTimestamp: new Date().toISOString()
    }));
  },

  /**
   * Terminate current session
   */
  logoutUser() {
    const user = this.getCurrentUser();
    const isPolice = user && (user.role === 'police' || user.role === 'incharge' || user.role === 'official');
    localStorage.removeItem(this.SESSION_KEY);
    
    // Redirect to relevant login page
    if (isPolice) {
      window.location.href = 'police-login.html';
    } else {
      window.location.href = 'login.html';
    }
  },

  /**
   * Guard for pages requiring authentication
   */
  requireAuth(allowedRoles = []) {
    const user = this.getCurrentUser();

    if (!user) {
      // Determine redirect path
      const path = window.location.pathname;
      if (path.includes('police') || path.includes('incharge') || path.includes('official') || path.includes('investigation') || path.includes('officer')) {
        window.location.href = 'police-login.html?redirect=' + encodeURIComponent(window.location.pathname.split('/').pop());
      } else {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname.split('/').pop());
      }
      return null;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // User is logged in but lacks appropriate role for this page
      console.warn(`Access denied for role: ${user.role}. Required: ${allowedRoles.join(', ')}`);
      this.redirectByRole(user.role);
      return null;
    }

    return user;
  },

  /**
   * Route user to their primary landing dashboard by role
   */
  redirectByRole(role) {
    switch (role) {
      case 'police':
        window.location.href = 'police-dashboard.html';
        break;
      case 'incharge':
        window.location.href = 'incharge-dashboard.html';
        break;
      case 'official':
        window.location.href = 'official-dashboard.html';
        break;
      case 'citizen':
      default:
        window.location.href = 'dashboard.html';
        break;
    }
  }
};
