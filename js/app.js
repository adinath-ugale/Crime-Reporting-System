/**
 * CRIME REPORTING SYSTEM (CRS) - CORE APPLICATION CONTROLLER
 * Global utilities: Toasts, Modals, Formatters, Status badges, and Lifecycle listeners.
 */

const App = {
  /**
   * Initialize Global Application Behavior
   */
  init() {
    this.setupToastContainer();
    this.setupPasswordToggles();
    this.setupModalDismissers();
  },

  /**
   * Create or locate toast container in DOM
   */
  setupToastContainer() {
    if (!document.getElementById('crs-toast-container')) {
      const container = document.createElement('div');
      container.id = 'crs-toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  },

  /**
   * Display a floating civic toast notification
   * @param {string} title
   * @param {string} message
   * @param {'success'|'error'|'info'|'warning'} type
   * @param {number} durationMs
   */
  showToast(title, message, type = 'info', durationMs = 4500) {
    this.setupToastContainer();
    const container = document.getElementById('crs-toast-container');

    const toast = document.createElement('div');
    toast.className = `toast toast-${type === 'danger' ? 'error' : type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
    } else if (type === 'error' || type === 'danger') {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>';
    } else {
      iconSvg = '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg>';
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.removeToast(toast);
    });

    container.appendChild(toast);

    if (durationMs > 0) {
      setTimeout(() => {
        this.removeToast(toast);
      }, durationMs);
    }
  },

  removeToast(toast) {
    if (!toast || toast.classList.contains('removing')) return;
    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 250);
  },

  /**
   * Modal Management
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
  },

  setupModalDismissers() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        e.target.classList.remove('show');
        document.body.style.overflow = '';
      }
      if (e.target.closest('[data-modal-close]')) {
        const modalBackdrop = e.target.closest('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.classList.remove('show');
          document.body.style.overflow = '';
        }
      }
    });
  },

  /**
   * Setup password visibility toggling
   */
  setupPasswordToggles() {
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling || btn.parentElement.querySelector('input');
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        btn.innerHTML = isPassword 
          ? '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>'
          : '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>';
      });
    });
  },

  /**
   * Render HTML Status Badge for complaint lifecycle
   */
  renderStatusBadge(status) {
    const s = (status || 'Submitted').toLowerCase();
    let badgeClass = 'badge-submitted';
    if (s === 'verified') badgeClass = 'badge-verified';
    else if (s === 'assigned') badgeClass = 'badge-assigned';
    else if (s === 'investigation') badgeClass = 'badge-investigation';
    else if (s === 'resolved') badgeClass = 'badge-resolved';
    else if (s === 'closed') badgeClass = 'badge-closed';

    return `<span class="badge ${badgeClass}"><span class="badge-dot"></span>${status}</span>`;
  },

  /**
   * Render HTML Role Badge
   */
  renderRoleBadge(role) {
    const r = (role || 'citizen').toLowerCase();
    let label = 'Citizen';
    let badgeClass = 'badge-role-citizen';
    if (r === 'police') { label = 'Police Officer'; badgeClass = 'badge-role-police'; }
    else if (r === 'incharge') { label = 'Station In-Charge'; badgeClass = 'badge-role-incharge'; }
    else if (r === 'official') { label = 'Head / Official'; badgeClass = 'badge-role-official'; }

    return `<span class="badge ${badgeClass}">${label}</span>`;
  },

  /**
   * Format ISO Date string (e.g., 22 Sep 2026)
   */
  formatDate(isoString) {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return isoString;
    }
  },

  /**
   * Format ISO Date & Time string (e.g., 22 Sep 2026, 02:30 PM)
   */
  formatDateTime(isoString) {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return isoString;
    }
  }
};

// Auto initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
