/**
 * CRIME REPORTING SYSTEM (CRS) - NAVIGATION & HEADER CONTROLLER
 * Active nav highlighters, mobile drawers, user badges, and unread counters.
 */

const Navigation = {
  init() {
    this.highlightActiveLinks();
    this.setupMobileMenu();
    this.setupSidebarDrawer();
    this.syncAuthNav();
    this.updateNotificationBadge();
  },

  /**
   * Automatically highlight active menu link matching current filename
   */
  highlightActiveLinks() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    // Top navbar links
    document.querySelectorAll('.crs-nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentFile || (currentFile === '' && href === 'index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Dashboard sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href === currentFile) {
        link.classList.add('active');
      }
    });
  },

  /**
   * Mobile Header Hamburger Menu
   */
  setupMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.crs-nav-links');

    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const isOpen = navLinks.classList.contains('open');
        toggleBtn.setAttribute('aria-expanded', isOpen);
      });

      // Close when clicking a link
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
        });
      });
    }
  },

  /**
   * Dashboard Mobile Off-canvas Drawer
   */
  setupSidebarDrawer() {
    const toggleBtn = document.querySelector('.sidebar-toggle-btn');
    const sidebar = document.querySelector('.dashboard-sidebar');

    if (!toggleBtn || !sidebar) return;

    // Create backdrop if not present
    let backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    const openSidebar = () => {
      sidebar.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    };

    toggleBtn.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    backdrop.addEventListener('click', closeSidebar);
  },

  /**
   * Synchronize Navigation bar according to Login Session
   */
  syncAuthNav() {
    const currentUser = AuthService.getCurrentUser();
    const navActions = document.querySelector('.crs-nav-actions');

    if (currentUser) {
      // In public header, if logged in, replace login/register with Dashboard & Logout
      if (navActions && !document.querySelector('.dashboard-layout')) {
        let dashboardHref = 'dashboard.html';
        if (currentUser.role === 'police') dashboardHref = 'police-dashboard.html';
        else if (currentUser.role === 'incharge') dashboardHref = 'incharge-dashboard.html';
        else if (currentUser.role === 'official') dashboardHref = 'official-dashboard.html';

        navActions.innerHTML = `
          <a href="${dashboardHref}" class="btn btn-sm btn-outline-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <button type="button" class="btn btn-sm btn-outline logout-btn">
            Logout
          </button>
        `;
      }

      // Populate dashboard user summary cards if present
      const nameElements = document.querySelectorAll('.user-display-name');
      nameElements.forEach(el => el.textContent = currentUser.fullName);

      const roleElements = document.querySelectorAll('.user-display-role');
      roleElements.forEach(el => {
        el.textContent = currentUser.rank || (currentUser.role === 'citizen' ? 'Citizen' : currentUser.role);
      });

      const avatarElements = document.querySelectorAll('.sidebar-user-avatar');
      avatarElements.forEach(el => {
        const initials = currentUser.fullName
          ? currentUser.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
          : 'U';
        el.textContent = initials;
      });
    }

    // Attach logout handlers to all logout buttons
    document.querySelectorAll('.logout-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to end your active session?')) {
          AuthService.logoutUser();
        }
      });
    });
  },

  /**
   * Update notification badge count in header/topbar
   */
  async updateNotificationBadge() {
    const user = AuthService.getCurrentUser();
    if (!user) return;

    const notifResponse = await ApiService.apiGetNotifications(user.id, user.role);
    if (notifResponse.success) {
      const unreadCount = notifResponse.data.filter(n => !n.read).length;
      document.querySelectorAll('.notification-badge').forEach(badge => {
        if (unreadCount > 0) {
          badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
});
