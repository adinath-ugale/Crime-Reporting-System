/**
 * CRIME REPORTING SYSTEM (CRS) - POLICE OPERATIONS & MANAGEMENT MODULE
 * Handles Police Complaints Management, Status Progression, Case Assignment,
 * Investigation Logs, Police Stations, and Officer Directory.
 */

const PoliceOps = {
  currentOfficer: null,

  /**
   * Initialize Police Complaints Management (complaints-management.html)
   */
  async initComplaintsManagement() {
    const user = AuthService.requireAuth(['police', 'incharge', 'official']);
    if (!user) return;
    this.currentOfficer = user;

    const tableBody = document.getElementById('policeComplaintsTableBody');
    const searchInput = document.getElementById('searchPoliceComplaints');
    const statusFilter = document.getElementById('filterPoliceStatus');
    const categoryFilter = document.getElementById('filterPoliceCategory');

    const render = async () => {
      const filters = {
        status: statusFilter ? statusFilter.value : 'All',
        crimeCategory: categoryFilter ? categoryFilter.value : 'All',
        search: searchInput ? searchInput.value.trim() : ''
      };

      // Incharge only views station complaints; officer views station or assigned
      if (user.role === 'police' && user.stationCode) {
        filters.stationCode = user.stationCode;
      } else if (user.role === 'incharge' && user.stationCode) {
        filters.stationCode = user.stationCode;
      }

      const res = await ApiService.apiGetComplaints(filters);
      const list = res.data || [];

      if (list.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center py-8 text-muted">
              No registered complaints match the specified operational filter.
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = list.map(c => `
        <tr>
          <td><span class="crs-table-code">${c.id}</span></td>
          <td><strong>${c.complainantName}</strong><br><small class="text-muted">${c.complainantMobile}</small></td>
          <td>${c.crimeCategory}</td>
          <td>${App.formatDate(c.incidentDate)}</td>
          <td>${c.assignedOfficerName || '<span class="text-warning">Unassigned</span>'}</td>
          <td>${App.renderStatusBadge(c.status)}</td>
          <td>
            <div class="flex gap-1">
              <button type="button" class="btn btn-sm btn-outline-primary" onclick="PoliceOps.openStatusModal('${c.id}')" title="Change Status">
                Update Status
              </button>
              <button type="button" class="btn btn-sm btn-outline" onclick="PoliceOps.openAssignModal('${c.id}')" title="Assign Officer">
                Assign
              </button>
              <a href="complaint-details.html?id=${c.id}" class="btn btn-sm btn-outline" title="Full Dossier">
                Dossier
              </a>
            </div>
          </td>
        </tr>
      `).join('');
    };

    if (searchInput) searchInput.addEventListener('input', render);
    if (statusFilter) statusFilter.addEventListener('change', render);
    if (categoryFilter) categoryFilter.addEventListener('change', render);

    await render();
    this.setupModals();
  },

  /**
   * Status Transition Modal
   */
  async openStatusModal(complaintId) {
    const res = await ApiService.apiGetComplaintById(complaintId);
    if (!res.success) return;
    const c = res.data;

    document.getElementById('statusModalComplaintId').value = c.id;
    document.getElementById('statusModalTitle').textContent = `Update Status for ${c.id}`;
    document.getElementById('statusModalSelect').value = c.status;
    document.getElementById('statusModalRemarks').value = '';

    App.openModal('updateStatusModal');
  },

  /**
   * Officer Assignment Modal
   */
  async openAssignModal(complaintId) {
    const res = await ApiService.apiGetComplaintById(complaintId);
    if (!res.success) return;
    const c = res.data;

    document.getElementById('assignModalComplaintId').value = c.id;
    document.getElementById('assignModalTitle').textContent = `Assign Officer to ${c.id}`;

    // Load Officers
    const officerSelect = document.getElementById('assignModalOfficerSelect');
    officerSelect.innerHTML = '<option value="">-- Select Investigating Officer --</option>';

    const offRes = await ApiService.apiGetOfficers(c.stationCode);
    if (offRes.success) {
      offRes.data.forEach(off => {
        const opt = document.createElement('option');
        opt.value = off.policeId;
        opt.textContent = `${off.name} (${off.rank}) - Active Cases: ${off.casesAssigned || 0}`;
        if (c.assignedOfficerId === off.policeId) opt.selected = true;
        officerSelect.appendChild(opt);
      });
    }

    App.openModal('assignOfficerModal');
  },

  /**
   * Setup Modal Form Listeners
   */
  setupModals() {
    // Status Submit
    const statusForm = document.getElementById('updateStatusForm');
    if (statusForm) {
      statusForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const complaintId = document.getElementById('statusModalComplaintId').value;
        const newStatus = document.getElementById('statusModalSelect').value;
        const remarks = document.getElementById('statusModalRemarks').value.trim();

        const officerName = this.currentOfficer ? this.currentOfficer.fullName : 'Duty Officer';
        const res = await ApiService.apiUpdateComplaintStatus(complaintId, newStatus, remarks, officerName);

        if (res.success) {
          App.closeModal('updateStatusModal');
          App.showToast('Status Updated', `Case ${complaintId} transitioned to ${newStatus}.`, 'success');
          // Re-render table if on complaints management
          if (document.getElementById('policeComplaintsTableBody')) {
            this.initComplaintsManagement();
          }
        }
      });
    }

    // Assign Submit
    const assignForm = document.getElementById('assignOfficerForm');
    if (assignForm) {
      assignForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const complaintId = document.getElementById('assignModalComplaintId').value;
        const select = document.getElementById('assignModalOfficerSelect');
        const officerId = select.value;
        const officerName = select.options[select.selectedIndex]?.text.split('(')[0].trim() || 'Officer';

        if (!officerId) {
          App.showToast('Selection Required', 'Please select an officer.', 'error');
          return;
        }

        const officerWhoAssigned = this.currentOfficer ? this.currentOfficer.fullName : 'In-Charge';
        const res = await ApiService.apiUpdateComplaintStatus(
          complaintId,
          'Assigned',
          `Case assigned to ${officerName} for investigation.`,
          officerWhoAssigned,
          officerId,
          officerName
        );

        if (res.success) {
          App.closeModal('assignOfficerModal');
          App.showToast('Officer Assigned', `Case ${complaintId} assigned to ${officerName}.`, 'success');
          if (document.getElementById('policeComplaintsTableBody')) {
            this.initComplaintsManagement();
          }
        }
      });
    }
  },

  /**
   * Initialize Investigation Module (investigation.html)
   */
  async initInvestigationModule() {
    const user = AuthService.requireAuth(['police', 'incharge', 'official']);
    if (!user) return;

    const caseSelect = document.getElementById('investigationCaseSelect');
    const logsContainer = document.getElementById('investigationLogsList');
    const logForm = document.getElementById('newInvestigationLogForm');

    // Populate Cases assigned / under investigation
    const res = await ApiService.apiGetComplaints({});
    const cases = (res.data || []).filter(c => c.status === 'Investigation' || c.status === 'Assigned' || c.status === 'Verified');

    if (caseSelect) {
      caseSelect.innerHTML = '<option value="">-- Select Active Case Dossier --</option>';
      cases.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.id} - ${c.crimeCategory} (${c.location})`;
        caseSelect.appendChild(opt);
      });

      caseSelect.addEventListener('change', () => this.loadInvestigationLogs(caseSelect.value));
    }

    if (logForm) {
      logForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const complaintId = caseSelect.value;
        if (!complaintId) {
          App.showToast('Select Case', 'Please select a case dossier to append investigation notes.', 'error');
          return;
        }

        const actionTaken = document.getElementById('invActionTaken').value.trim();
        const evidenceStatus = document.getElementById('invEvidenceStatus').value.trim();
        const nextAction = document.getElementById('invNextAction').value.trim();
        const notes = document.getElementById('invNotes').value.trim();

        if (!actionTaken) {
          App.showToast('Field Required', 'Action taken cannot be empty.', 'error');
          return;
        }

        const logRecord = {
          complaintId,
          officerId: user.policeId || user.id,
          officerName: user.fullName,
          actionTaken,
          evidenceStatus: evidenceStatus || 'Documented in case diary',
          nextAction: nextAction || 'Pending further field inquiries',
          notes: notes || 'Entry authorized'
        };

        const addRes = await ApiService.apiAddInvestigation(logRecord);
        if (addRes.success) {
          App.showToast('Diary Recorded', 'Investigation log appended to official case diary.', 'success');
          logForm.reset();
          this.loadInvestigationLogs(complaintId);
        }
      });
    }

    // Auto-load if query parameter exists
    const urlParams = new URLSearchParams(window.location.search);
    const prefillCase = urlParams.get('id');
    if (prefillCase && caseSelect) {
      caseSelect.value = prefillCase;
      this.loadInvestigationLogs(prefillCase);
    }
  },

  async loadInvestigationLogs(complaintId) {
    const logsContainer = document.getElementById('investigationLogsList');
    if (!logsContainer) return;

    if (!complaintId) {
      logsContainer.innerHTML = '<div class="text-center py-8 text-muted">Select an active case above to inspect official diary notes.</div>';
      return;
    }

    const res = await ApiService.apiGetInvestigations(complaintId);
    const logs = res.data || [];

    if (logs.length === 0) {
      logsContainer.innerHTML = `
        <div class="empty-state py-6">
          <p class="text-muted">No chronological investigation entries recorded yet for case <strong>${complaintId}</strong>.</p>
        </div>
      `;
      return;
    }

    logsContainer.innerHTML = `
      <div class="timeline">
        ${logs.map((log, idx) => `
          <div class="timeline-item ${idx === 0 ? 'active' : 'completed'}">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-title">${log.officerName}</span>
                <span class="timeline-date">${App.formatDateTime(log.date)}</span>
              </div>
              <div class="timeline-body">
                <p><strong>Action Taken:</strong> ${log.actionTaken}</p>
                <p class="mt-1"><strong>Evidence State:</strong> ${log.evidenceStatus}</p>
                <p class="mt-1"><strong>Next Action:</strong> ${log.nextAction}</p>
                ${log.notes ? `<p class="mt-1 text-muted"><em>Notes: ${log.notes}</em></p>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /**
   * Police Stations Management (police-stations.html)
   */
  async initStationsManagement() {
    const user = AuthService.requireAuth(['police', 'incharge', 'official']);
    if (!user) return;

    const listContainer = document.getElementById('stationsListContainer');
    const searchInput = document.getElementById('searchStation');
    const addStationForm = document.getElementById('addStationForm');

    const render = async () => {
      const res = await ApiService.apiGetStations();
      let stations = res.data || [];

      if (searchInput && searchInput.value.trim()) {
        const query = searchInput.value.trim().toLowerCase();
        stations = stations.filter(s => 
          s.name.toLowerCase().includes(query) ||
          s.code.toLowerCase().includes(query) ||
          s.district.toLowerCase().includes(query)
        );
      }

      if (stations.length === 0) {
        listContainer.innerHTML = '<div class="text-center py-8 text-muted">No police stations found.</div>';
        return;
      }

      listContainer.innerHTML = stations.map(s => `
        <div class="card card-elevated">
          <div class="card-header">
            <div>
              <span class="badge badge-submitted">${s.code}</span>
              <h4 class="card-title mt-1">${s.name}</h4>
            </div>
            <span class="badge badge-verified">${s.status || 'Active'}</span>
          </div>
          <div class="card-body" style="font-size: 0.85rem; line-height: 1.7;">
            <div><strong>District:</strong> ${s.district}</div>
            <div><strong>City / State:</strong> ${s.city}, ${s.state} - ${s.pincode}</div>
            <div><strong>Station In-Charge:</strong> ${s.inCharge || 'Pending Appointment'}</div>
            <div><strong>Emergency Contact:</strong> <a href="tel:${s.contact}">${s.contact}</a></div>
            <div><strong>Official Email:</strong> ${s.email}</div>
          </div>
          <div class="card-footer">
            <span class="text-muted font-size-xs">${s.totalPersonnel || 30} Assigned Personnel</span>
            <button type="button" class="btn btn-sm btn-outline-primary" onclick="PoliceOps.openStationDetails('${s.code}')">
              Station Dossier
            </button>
          </div>
        </div>
      `).join('');
    };

    if (searchInput) searchInput.addEventListener('input', render);

    if (addStationForm) {
      addStationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          name: document.getElementById('stationName').value.trim(),
          code: document.getElementById('stationCodeInput').value.trim().toUpperCase(),
          district: document.getElementById('stationDistrict').value.trim(),
          city: document.getElementById('stationCity').value.trim(),
          state: 'Maharashtra',
          pincode: document.getElementById('stationPincode').value.trim(),
          contact: document.getElementById('stationContact').value.trim(),
          email: document.getElementById('stationEmail').value.trim(),
          inCharge: document.getElementById('stationInCharge').value.trim(),
          status: 'Active',
          totalPersonnel: parseInt(document.getElementById('stationPersonnel').value) || 25
        };

        const res = await ApiService.apiSaveStation(payload);
        if (res.success) {
          App.closeModal('addStationModal');
          App.showToast('Station Registered', `${payload.name} added to station network.`, 'success');
          addStationForm.reset();
          render();
        }
      });
    }

    await render();
  },

  openStationDetails(code) {
    App.showToast('Station Directory', `Viewing jurisdictional jurisdiction for ${code}.`, 'info');
  },

  /**
   * Officer Management (officer-management.html)
   */
  async initOfficerManagement() {
    const user = AuthService.requireAuth(['incharge', 'official']);
    if (!user) return;

    const tableBody = document.getElementById('officersTableBody');
    const searchInput = document.getElementById('searchOfficer');
    const addOfficerForm = document.getElementById('addOfficerForm');

    const render = async () => {
      const res = await ApiService.apiGetOfficers();
      let officers = res.data || [];

      if (searchInput && searchInput.value.trim()) {
        const query = searchInput.value.trim().toLowerCase();
        officers = officers.filter(o => 
          o.name.toLowerCase().includes(query) ||
          o.policeId.toLowerCase().includes(query) ||
          o.stationName.toLowerCase().includes(query)
        );
      }

      tableBody.innerHTML = officers.map(o => `
        <tr>
          <td><span class="crs-table-code">${o.policeId}</span></td>
          <td><strong>${o.name}</strong><br><small class="text-muted">${o.email}</small></td>
          <td>${o.rank}</td>
          <td>${o.stationName} (${o.stationCode})</td>
          <td>${o.district}</td>
          <td><strong>${o.casesAssigned || 0}</strong></td>
          <td><span class="badge badge-verified">${o.status}</span></td>
        </tr>
      `).join('');
    };

    if (searchInput) searchInput.addEventListener('input', render);

    if (addOfficerForm) {
      addOfficerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          name: document.getElementById('officerName').value.trim(),
          policeId: document.getElementById('officerPoliceId').value.trim().toUpperCase(),
          rank: document.getElementById('officerRank').value,
          stationCode: document.getElementById('officerStationSelect').value,
          stationName: document.getElementById('officerStationSelect').options[document.getElementById('officerStationSelect').selectedIndex].text,
          district: document.getElementById('officerDistrict').value.trim(),
          email: document.getElementById('officerEmail').value.trim(),
          mobile: document.getElementById('officerMobile').value.trim(),
          casesAssigned: 0,
          status: 'On Duty'
        };

        const res = await ApiService.apiSaveOfficer(payload);
        if (res.success) {
          App.closeModal('addOfficerModal');
          App.showToast('Officer Registered', `Officer ${payload.name} deployed.`, 'success');
          addOfficerForm.reset();
          render();
        }
      });
    }

    await render();
  }
};
