/**
 * CRIME REPORTING SYSTEM (CRS) - NOTIFICATIONS MODULE
 * Dynamic notification dispatching, unread indicators, mark-as-read and deletion.
 */

const NotificationsCenter = {
  currentUser: null,

  async initNotifications() {
    this.currentUser = AuthService.requireAuth();
    if (!this.currentUser) return;

    const listContainer = document.getElementById('notificationsList');
    const filterAllBtn = document.getElementById('notifFilterAll');
    const filterUnreadBtn = document.getElementById('notifFilterUnread');
    const markAllBtn = document.getElementById('markAllReadBtn');

    let currentFilter = 'all';

    const render = async () => {
      const res = await ApiService.apiGetNotifications(this.currentUser.id, this.currentUser.role);
      let list = res.data || [];

      if (currentFilter === 'unread') {
        list = list.filter(n => !n.read);
      }

      if (list.length === 0) {
        listContainer.innerHTML = `
          <div class="empty-state py-8">
            <div class="empty-state-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </div>
            <h4 class="empty-state-title">No notifications</h4>
            <p class="empty-state-desc">You are all caught up. New updates regarding your complaints and investigations will appear here.</p>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = list.map(n => `
        <div class="card ${!n.read ? 'card-elevated' : ''} mb-3" style="${!n.read ? 'border-left: 4px solid var(--color-primary);' : ''}">
          <div class="card-body py-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="emergency-icon-pulse" style="width: 36px; height: 36px; background: ${!n.read ? 'var(--color-primary-light)' : 'var(--color-bg-subtle)'}; color: ${!n.read ? 'var(--color-primary)' : 'var(--color-slate-light)'};">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h5 class="font-bold text-navy" style="font-size: 0.95rem;">${n.title}</h5>
                    ${!n.read ? '<span class="badge badge-submitted font-size-xs">New</span>' : ''}
                  </div>
                  <p class="text-slate font-size-sm mt-1" style="line-height: 1.5;">${n.message}</p>
                  <span class="text-muted font-size-xs">${App.formatDateTime(n.timestamp)}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                ${!n.read ? `
                  <button type="button" class="btn btn-sm btn-outline-primary" onclick="NotificationsCenter.markRead('${n.id}')">
                    Mark Read
                  </button>
                ` : ''}
                ${n.complaintId ? `
                  <a href="complaint-details.html?id=${n.complaintId}" class="btn btn-sm btn-outline">
                    View Case
                  </a>
                ` : ''}
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="NotificationsCenter.deleteNotif('${n.id}')" title="Delete">
                  &times;
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('');

      Navigation.updateNotificationBadge();
    };

    if (filterAllBtn) {
      filterAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        filterAllBtn.classList.add('active', 'btn-primary');
        filterAllBtn.classList.remove('btn-outline');
        if (filterUnreadBtn) {
          filterUnreadBtn.classList.remove('active', 'btn-primary');
          filterUnreadBtn.classList.add('btn-outline');
        }
        render();
      });
    }

    if (filterUnreadBtn) {
      filterUnreadBtn.addEventListener('click', () => {
        currentFilter = 'unread';
        filterUnreadBtn.classList.add('active', 'btn-primary');
        filterUnreadBtn.classList.remove('btn-outline');
        if (filterAllBtn) {
          filterAllBtn.classList.remove('active', 'btn-primary');
          filterAllBtn.classList.add('btn-outline');
        }
        render();
      });
    }

    if (markAllBtn) {
      markAllBtn.addEventListener('click', async () => {
        await ApiService.apiMarkAllNotificationsRead(this.currentUser.id, this.currentUser.role);
        App.showToast('Updated', 'All notifications marked as read.', 'success');
        render();
      });
    }

    await render();
  },

  async markRead(id) {
    await ApiService.apiMarkNotificationRead(id);
    this.initNotifications();
  },

  async deleteNotif(id) {
    await ApiService.apiDeleteNotification(id);
    App.showToast('Removed', 'Notification deleted.', 'info');
    this.initNotifications();
  }
};
