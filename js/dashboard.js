/**
 * CRIME REPORTING SYSTEM (CRS) - DASHBOARDS & ANALYTICS CONTROLLER
 * Dynamic calculations, pure CSS/SVG visualizations, and CSV report export.
 */

const Dashboards = {
  /**
   * 1. CITIZEN DASHBOARD (dashboard.html)
   */
  async initCitizenDashboard() {
    const user = AuthService.requireAuth(['citizen']);
    if (!user) return;

    // Fetch complaints for this citizen
    const res = await ApiService.apiGetComplaints({ userId: user.id });
    const complaints = res.data || [];

    // Calculate real dynamic KPI metrics
    const totalCount = complaints.length;
    const submittedCount = complaints.filter(c => c.status === 'Submitted').length;
    const investigationCount = complaints.filter(c => c.status === 'Investigation' || c.status === 'Assigned' || c.status === 'Verified').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

    const elTotal = document.getElementById('citizenTotalComplaints');
    const elSubmitted = document.getElementById('citizenSubmittedComplaints');
    const elInvestigation = document.getElementById('citizenInvestigationComplaints');
    const elResolved = document.getElementById('citizenResolvedComplaints');

    if (elTotal) elTotal.textContent = totalCount;
    if (elSubmitted) elSubmitted.textContent = submittedCount;
    if (elInvestigation) elInvestigation.textContent = investigationCount;
    if (elResolved) elResolved.textContent = resolvedCount;

    // Render Recent Complaints Table
    const tableBody = document.getElementById('citizenRecentComplaintsBody');
    if (tableBody) {
      if (complaints.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-8 text-muted">
              You have not lodged any complaints yet. Use the button above to file a report.
            </td>
          </tr>
        `;
      } else {
        const recent = complaints.slice(0, 5);
        tableBody.innerHTML = recent.map(c => `
          <tr>
            <td><span class="crs-table-code">${c.id}</span></td>
            <td><strong>${c.crimeCategory}</strong></td>
            <td>${App.formatDate(c.incidentDate)}</td>
            <td>${c.stationName || c.stationCode}</td>
            <td>${App.renderStatusBadge(c.status)}</td>
            <td>
              <a href="complaint-details.html?id=${c.id}" class="btn btn-sm btn-outline-primary">
                Details
              </a>
            </td>
          </tr>
        `).join('');
      }
    }

    // Citizen Profile Summary widget
    const profileWidget = document.getElementById('citizenProfileWidget');
    if (profileWidget) {
      profileWidget.innerHTML = `
        <div class="flex items-center gap-3 mb-4">
          <div class="sidebar-user-avatar" style="width: 48px; height: 48px; font-size: 1.1rem;">
            ${user.fullName ? user.fullName[0] : 'U'}
          </div>
          <div>
            <h4 class="font-bold">${user.fullName}</h4>
            <span class="badge badge-role-citizen">Citizen</span>
          </div>
        </div>
        <div style="font-size: 0.85rem; line-height: 1.8;">
          <div><strong>Mobile:</strong> ${user.mobile}</div>
          <div><strong>Email:</strong> ${user.email}</div>
          <div><strong>District:</strong> ${user.district || 'Metro District'}</div>
        </div>
        <div class="mt-4 pt-3" style="border-top: 1px solid var(--color-border);">
          <a href="profile.html" class="btn btn-sm btn-outline btn-block">Edit Profile</a>
        </div>
      `;
    }
  },

  /**
   * 2. POLICE DASHBOARD (police-dashboard.html)
   */
  async initPoliceDashboard() {
    const user = AuthService.requireAuth(['police', 'incharge', 'official']);
    if (!user) return;

    const res = await ApiService.apiGetComplaints({});
    const allComplaints = res.data || [];

    // Filter by station if station-level officer
    const complaints = user.role === 'official' 
      ? allComplaints 
      : allComplaints.filter(c => !user.stationCode || c.stationCode === user.stationCode);

    // Dynamic metrics
    const totalCount = complaints.length;
    const newCount = complaints.filter(c => c.status === 'Submitted').length;
    const underInvCount = complaints.filter(c => c.status === 'Investigation' || c.status === 'Assigned' || c.status === 'Verified').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
    const highPriorityCount = complaints.filter(c => c.priority === 'High' && c.status !== 'Closed').length;

    const elTotal = document.getElementById('policeTotal');
    const elNew = document.getElementById('policeNew');
    const elInv = document.getElementById('policeInvestigation');
    const elResolved = document.getElementById('policeResolved');
    const elPriority = document.getElementById('policePriority');

    if (elTotal) elTotal.textContent = totalCount;
    if (elNew) elNew.textContent = newCount;
    if (elInv) elInv.textContent = underInvCount;
    if (elResolved) elResolved.textContent = resolvedCount;
    if (elPriority) elPriority.textContent = highPriorityCount;

    // Render Recent Station Cases Table
    const tableBody = document.getElementById('policeRecentTableBody');
    if (tableBody) {
      if (complaints.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center py-6 text-muted">No cases currently active in this jurisdiction.</td></tr>';
      } else {
        const recent = complaints.slice(0, 6);
        tableBody.innerHTML = recent.map(c => `
          <tr>
            <td><span class="crs-table-code">${c.id}</span></td>
            <td><strong>${c.complainantName}</strong></td>
            <td>${c.crimeCategory}</td>
            <td>${App.formatDate(c.incidentDate)}</td>
            <td>${c.assignedOfficerName || '<span class="text-warning">Unassigned</span>'}</td>
            <td>${App.renderStatusBadge(c.status)}</td>
            <td>
              <a href="complaints-management.html" class="btn btn-sm btn-outline-primary">Manage</a>
            </td>
          </tr>
        `).join('');
      }
    }
  },

  /**
   * 3. STATION IN-CHARGE DASHBOARD (incharge-dashboard.html)
   */
  async initInChargeDashboard() {
    const user = AuthService.requireAuth(['incharge', 'official']);
    if (!user) return;

    const res = await ApiService.apiGetComplaints({});
    const all = res.data || [];
    const stationCode = user.stationCode || 'CPS-01';
    const stationCases = all.filter(c => c.stationCode === stationCode);

    const elStationCases = document.getElementById('inchargeTotalCases');
    const elPending = document.getElementById('inchargePending');
    const elInv = document.getElementById('inchargeInvestigation');
    const elResolved = document.getElementById('inchargeResolved');

    if (elStationCases) elStationCases.textContent = stationCases.length;
    if (elPending) elPending.textContent = stationCases.filter(c => c.status === 'Submitted' || c.status === 'Verified').length;
    if (elInv) elInv.textContent = stationCases.filter(c => c.status === 'Investigation' || c.status === 'Assigned').length;
    if (elResolved) elResolved.textContent = stationCases.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

    // Station Officers Deployment Breakdown
    const offRes = await ApiService.apiGetOfficers(stationCode);
    const officersListEl = document.getElementById('inchargeOfficersList');
    if (officersListEl && offRes.success) {
      officersListEl.innerHTML = offRes.data.map(o => `
        <div class="flex items-center justify-between py-2" style="border-bottom: 1px solid var(--color-border);">
          <div>
            <strong>${o.name}</strong>
            <div class="text-muted font-size-xs">${o.rank} • ID: ${o.policeId}</div>
          </div>
          <div class="text-right">
            <span class="badge badge-submitted">${o.casesAssigned || 0} Cases</span>
            <div class="font-size-xs text-success mt-1">● ${o.status}</div>
          </div>
        </div>
      `).join('');
    }

    // Pending Reassignment Table
    const tableBody = document.getElementById('inchargePendingTableBody');
    if (tableBody) {
      const pendingCases = stationCases.filter(c => c.assignedOfficerName === 'Unassigned' || c.status === 'Submitted');
      if (pendingCases.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-6 text-muted">All current cases are assigned and actively monitored.</td></tr>';
      } else {
        tableBody.innerHTML = pendingCases.map(c => `
          <tr>
            <td><span class="crs-table-code">${c.id}</span></td>
            <td>${c.crimeCategory}</td>
            <td>${App.formatDate(c.incidentDate)}</td>
            <td>${App.renderStatusBadge(c.status)}</td>
            <td>
              <a href="complaints-management.html" class="btn btn-sm btn-primary">Assign Officer</a>
            </td>
          </tr>
        `).join('');
      }
    }
  },

  /**
   * 4. OFFICIAL / HEADQUARTERS DASHBOARD (official-dashboard.html)
   */
  async initOfficialDashboard() {
    const user = AuthService.requireAuth(['official']);
    if (!user) return;

    const res = await ApiService.apiGetComplaints({});
    const complaints = res.data || [];
    const stRes = await ApiService.apiGetStations();
    const stations = stRes.data || [];

    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Submitted' || c.status === 'Verified').length;
    const investigation = complaints.filter(c => c.status === 'Investigation' || c.status === 'Assigned').length;
    const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

    const elTotal = document.getElementById('officialTotalComplaints');
    const elStations = document.getElementById('officialTotalStations');
    const elPending = document.getElementById('officialPending');
    const elInv = document.getElementById('officialInvestigation');
    const elResolved = document.getElementById('officialResolved');

    if (elTotal) elTotal.textContent = total;
    if (elStations) elStations.textContent = stations.length;
    if (elPending) elPending.textContent = pending;
    if (elInv) elInv.textContent = investigation;
    if (elResolved) elResolved.textContent = resolved;

    // Render Pure CSS / SVG Visualizations
    this.renderCategoryBarChart(complaints);
    this.renderStatusProgressBars(complaints);
    this.renderDistrictDistribution(complaints);
  },

  /**
   * Pure CSS Bar Chart: Crime Category Frequency
   */
  renderCategoryBarChart(complaints) {
    const container = document.getElementById('categoryBarChart');
    if (!container) return;

    // Tally by category
    const tallies = {};
    complaints.forEach(c => {
      tallies[c.crimeCategory] = (tallies[c.crimeCategory] || 0) + 1;
    });

    const categories = Object.keys(tallies);
    const maxVal = Math.max(...Object.values(tallies), 1);

    container.innerHTML = categories.map(cat => {
      const count = tallies[cat];
      const heightPercent = Math.max((count / maxVal) * 85, 10);
      return `
        <div class="bar-column">
          <div class="bar-fill-wrapper">
            <div class="bar-fill" style="height: ${heightPercent}%;">
              <span class="bar-tooltip">${count}</span>
            </div>
          </div>
          <span class="bar-label">${cat}</span>
        </div>
      `;
    }).join('');
  },

  /**
   * Pure CSS Horizontal Progress Bars: Status Breakdown
   */
  renderStatusProgressBars(complaints) {
    const container = document.getElementById('statusProgressContainer');
    if (!container) return;

    const total = complaints.length || 1;
    const statuses = [
      { name: 'Submitted', count: complaints.filter(c => c.status === 'Submitted').length, class: '' },
      { name: 'Investigation', count: complaints.filter(c => c.status === 'Investigation' || c.status === 'Assigned').length, class: 'fill-warning' },
      { name: 'Resolved', count: complaints.filter(c => c.status === 'Resolved').length, class: 'fill-success' },
      { name: 'Closed', count: complaints.filter(c => c.status === 'Closed').length, class: 'fill-purple' }
    ];

    container.innerHTML = statuses.map(st => {
      const pct = Math.round((st.count / total) * 100);
      return `
        <div class="progress-item">
          <div class="progress-header">
            <span>${st.name}</span>
            <span>${st.count} (${pct}%)</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${st.class}" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * District Distribution List
   */
  renderDistrictDistribution(complaints) {
    const container = document.getElementById('districtDistributionList');
    if (!container) return;

    const districtTallies = {};
    complaints.forEach(c => {
      const d = c.district || 'Unassigned';
      districtTallies[d] = (districtTallies[d] || 0) + 1;
    });

    container.innerHTML = Object.entries(districtTallies).map(([dist, count]) => `
      <div class="flex items-center justify-between py-2" style="border-bottom: 1px solid var(--color-border);">
        <strong>${dist}</strong>
        <span class="badge badge-submitted">${count} Cases Registered</span>
      </div>
    `).join('');
  },

  /**
   * 5. REPORTS & CSV EXPORT MODULE (reports.html)
   */
  async initReports() {
    const user = AuthService.requireAuth(['police', 'incharge', 'official']);
    if (!user) return;

    const tableBody = document.getElementById('reportsTableBody');
    const filterDistrict = document.getElementById('reportDistrict');
    const filterCategory = document.getElementById('reportCategory');
    const filterStatus = document.getElementById('reportStatus');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const printBtn = document.getElementById('printReportBtn');

    let currentReportData = [];

    const generateReport = async () => {
      const res = await ApiService.apiGetComplaints({});
      let list = res.data || [];

      if (filterDistrict && filterDistrict.value !== 'All') {
        list = list.filter(c => c.district === filterDistrict.value);
      }
      if (filterCategory && filterCategory.value !== 'All') {
        list = list.filter(c => c.crimeCategory === filterCategory.value);
      }
      if (filterStatus && filterStatus.value !== 'All') {
        list = list.filter(c => c.status === filterStatus.value);
      }

      currentReportData = list;

      // Update KPI metrics
      const elTotal = document.getElementById('reportTotalCount');
      const elResolved = document.getElementById('reportResolvedCount');
      const elPending = document.getElementById('reportPendingCount');
      const elInv = document.getElementById('reportInvCount');

      if (elTotal) elTotal.textContent = list.length;
      if (elResolved) elResolved.textContent = list.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
      if (elPending) elPending.textContent = list.filter(c => c.status === 'Submitted' || c.status === 'Verified').length;
      if (elInv) elInv.textContent = list.filter(c => c.status === 'Investigation' || c.status === 'Assigned').length;

      // Render table
      if (tableBody) {
        if (list.length === 0) {
          tableBody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-muted">No records match the filter criteria.</td></tr>';
        } else {
          tableBody.innerHTML = list.map(c => `
            <tr>
              <td><span class="crs-table-code">${c.id}</span></td>
              <td>${c.complainantName}</td>
              <td>${c.crimeCategory}</td>
              <td>${App.formatDate(c.incidentDate)}</td>
              <td>${c.district}</td>
              <td>${c.assignedOfficerName || 'Unassigned'}</td>
              <td>${App.renderStatusBadge(c.status)}</td>
            </tr>
          `).join('');
        }
      }
    };

    if (filterDistrict) filterDistrict.addEventListener('change', generateReport);
    if (filterCategory) filterCategory.addEventListener('change', generateReport);
    if (filterStatus) filterStatus.addEventListener('change', generateReport);

    // CSV Export via JavaScript Blob
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        if (currentReportData.length === 0) {
          App.showToast('No Data', 'There is no complaint data to export.', 'error');
          return;
        }

        const headers = ['Complaint ID', 'Complainant', 'Mobile', 'Crime Category', 'Incident Date', 'Incident Time', 'Location', 'District', 'Police Station', 'Assigned Officer', 'Status', 'Submitted At'];
        
        const rows = currentReportData.map(c => [
          `"${c.id}"`,
          `"${c.complainantName || ''}"`,
          `"${c.complainantMobile || ''}"`,
          `"${c.crimeCategory || ''}"`,
          `"${c.incidentDate || ''}"`,
          `"${c.incidentTime || ''}"`,
          `"${(c.location || '').replace(/"/g, '""')}"`,
          `"${c.district || ''}"`,
          `"${c.stationName || c.stationCode || ''}"`,
          `"${c.assignedOfficerName || 'Unassigned'}"`,
          `"${c.status || ''}"`,
          `"${c.submittedAt || ''}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `CRS_Complaints_Report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        App.showToast('Export Completed', 'Official CSV report generated and downloaded.', 'success');
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }

    await generateReport();
  }
};
