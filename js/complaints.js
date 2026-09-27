/**
 * CRIME REPORTING SYSTEM (CRS) - COMPLAINTS MODULE
 * Handles Multi-step Reporting, Complaint History, Details View, and Live Tracking.
 */

const Complaints = {
  selectedEvidenceFiles: [],

  /**
   * Initialize Report Crime Form (report-crime.html)
   */
  initReportCrime() {
    const user = AuthService.requireAuth(['citizen']);
    if (!user) return;

    // Prefill Section 1: Complainant Information
    const nameField = document.getElementById('complainantName');
    const mobileField = document.getElementById('complainantMobile');
    const emailField = document.getElementById('complainantEmail');
    if (nameField) nameField.value = user.fullName || '';
    if (mobileField) mobileField.value = user.mobile || '';
    if (emailField) emailField.value = user.email || '';

    // Load Police Stations into Select Dropdown
    this.populateStationDropdown();

    // Setup Multi-Step Wizard
    this.setupStepperWizard();

    // Setup Evidence Dropzone & Metadata Handler
    this.setupEvidenceDropzone();

    // Setup Final Submission Handler
    const form = document.getElementById('crimeReportForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleReportSubmit(e, user));
    }
  },

  /**
   * Populate Police Station Select Dropdown
   */
  async populateStationDropdown() {
    const stationSelect = document.getElementById('stationCode');
    if (!stationSelect) return;

    const res = await ApiService.apiGetStations();
    if (res.success && res.data.length > 0) {
      stationSelect.innerHTML = '<option value="">-- Select Jurisdictional Police Station --</option>';
      res.data.forEach(station => {
        const opt = document.createElement('option');
        opt.value = station.code;
        opt.textContent = `${station.name} (${station.code}) - ${station.district}`;
        stationSelect.appendChild(opt);
      });
    }
  },

  /**
   * Multi-Step Stepper Wizard Handler
   */
  setupStepperWizard() {
    let currentStep = 1;
    const totalSteps = 7;

    const showStep = (stepNum) => {
      document.querySelectorAll('.step-pane').forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `step-${stepNum}`) {
          pane.classList.add('active');
        }
      });

      document.querySelectorAll('.stepper-nav-item').forEach((item, idx) => {
        const step = idx + 1;
        item.classList.remove('active', 'completed');
        if (step === stepNum) item.classList.add('active');
        else if (step < stepNum) item.classList.add('completed');
      });

      currentStep = stepNum;
      window.scrollTo({ top: 150, behavior: 'smooth' });
    };

    // Next Buttons
    document.querySelectorAll('[data-next-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.validateCurrentStep(currentStep)) {
          if (currentStep < totalSteps) {
            showStep(currentStep + 1);
          }
        }
      });
    });

    // Previous Buttons
    document.querySelectorAll('[data-prev-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 1) {
          showStep(currentStep - 1);
        }
      });
    });
  },

  /**
   * Validate fields in the active step before proceeding
   */
  validateCurrentStep(step) {
    let isValid = true;

    if (step === 1) {
      const name = document.getElementById('complainantName');
      const mobile = document.getElementById('complainantMobile');
      const email = document.getElementById('complainantEmail');

      if (!Validator.isRequired(name.value)) {
        Validator.showError(name, 'Full name is required.');
        isValid = false;
      } else { Validator.clearError(name); }

      if (!Validator.isValidMobile(mobile.value)) {
        Validator.showError(mobile, 'Please enter a valid 10-digit mobile number.');
        isValid = false;
      } else { Validator.clearError(mobile); }

      if (!Validator.isValidEmail(email.value)) {
        Validator.showError(email, 'Please enter a valid email address.');
        isValid = false;
      } else { Validator.clearError(email); }
    } else if (step === 2) {
      const category = document.getElementById('crimeCategory');
      const date = document.getElementById('incidentDate');
      const time = document.getElementById('incidentTime');
      const location = document.getElementById('incidentLocation');
      const district = document.getElementById('incidentDistrict');

      if (!Validator.isRequired(category.value)) {
        Validator.showError(category, 'Please select a crime category.');
        isValid = false;
      } else { Validator.clearError(category); }

      if (!Validator.isRequired(date.value)) {
        Validator.showError(date, 'Incident date is required.');
        isValid = false;
      } else { Validator.clearError(date); }

      if (!Validator.isRequired(time.value)) {
        Validator.showError(time, 'Incident time is required.');
        isValid = false;
      } else { Validator.clearError(time); }

      if (!Validator.isRequired(location.value)) {
        Validator.showError(location, 'Incident location/address is required.');
        isValid = false;
      } else { Validator.clearError(location); }

      if (!Validator.isRequired(district.value)) {
        Validator.showError(district, 'District is required.');
        isValid = false;
      } else { Validator.clearError(district); }
    } else if (step === 3) {
      const desc = document.getElementById('incidentDescription');
      if (!Validator.isRequired(desc.value) || desc.value.trim().length < 20) {
        Validator.showError(desc, 'Please provide a detailed description (minimum 20 characters).');
        isValid = false;
      } else { Validator.clearError(desc); }
    } else if (step === 6) {
      const station = document.getElementById('stationCode');
      if (!Validator.isRequired(station.value)) {
        Validator.showError(station, 'Please select the nearest police station.');
        isValid = false;
      } else { Validator.clearError(station); }
    } else if (step === 7) {
      const declaration = document.getElementById('declarationAccepted');
      if (declaration && !declaration.checked) {
        Validator.showError(declaration, 'You must confirm the truthfulness of this report under legal notice.');
        isValid = false;
      } else if (declaration) {
        Validator.clearError(declaration);
      }
    }

    return isValid;
  },

  /**
   * Evidence Upload Handler (Stores metadata in client-side storage)
   */
  setupEvidenceDropzone() {
    const dropzone = document.getElementById('evidenceDropzone');
    const fileInput = document.getElementById('evidenceFileInput');
    const previewList = document.getElementById('evidencePreviewList');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.addEvidenceFiles(e.dataTransfer.files);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        this.addEvidenceFiles(fileInput.files);
      }
    });
  },

  addEvidenceFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Format file size
      const sizeFormatted = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      this.selectedEvidenceFiles.push({
        name: file.name,
        size: sizeFormatted,
        type: file.type || 'application/octet-stream'
      });
    }
    this.renderEvidencePreviews();
  },

  renderEvidencePreviews() {
    const previewList = document.getElementById('evidencePreviewList');
    if (!previewList) return;

    if (this.selectedEvidenceFiles.length === 0) {
      previewList.innerHTML = '';
      return;
    }

    previewList.innerHTML = this.selectedEvidenceFiles.map((file, idx) => `
      <div class="file-preview-item">
        <div class="file-info">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <span class="file-name">${file.name}</span>
          <span class="file-size">(${file.size})</span>
        </div>
        <button type="button" class="file-remove-btn" onclick="Complaints.removeEvidenceFile(${idx})" title="Remove file">
          &times;
        </button>
      </div>
    `).join('');
  },

  removeEvidenceFile(idx) {
    this.selectedEvidenceFiles.splice(idx, 1);
    this.renderEvidencePreviews();
  },

  /**
   * Submit Crime Complaint Handler
   */
  async handleReportSubmit(e, user) {
    e.preventDefault();

    if (!this.validateCurrentStep(7)) {
      return;
    }

    const submitBtn = document.getElementById('submitReportBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registering Complaint...';
    }

    const payload = {
      userId: user.id,
      complainantName: document.getElementById('complainantName').value.trim(),
      complainantMobile: document.getElementById('complainantMobile').value.trim(),
      complainantEmail: document.getElementById('complainantEmail').value.trim(),
      crimeCategory: document.getElementById('crimeCategory').value,
      incidentDate: document.getElementById('incidentDate').value,
      incidentTime: document.getElementById('incidentTime').value,
      location: document.getElementById('incidentLocation').value.trim(),
      city: document.getElementById('incidentCity').value.trim() || 'Metro City',
      district: document.getElementById('incidentDistrict').value,
      state: document.getElementById('incidentState').value || 'Maharashtra',
      description: document.getElementById('incidentDescription').value.trim(),
      suspect: {
        name: document.getElementById('suspectName').value.trim() || 'Unknown',
        description: document.getElementById('suspectDescription').value.trim() || 'Not specified',
        vehicleNo: document.getElementById('suspectVehicle').value.trim() || 'N/A',
        additionalInfo: document.getElementById('suspectAdditional').value.trim() || 'None'
      },
      evidence: this.selectedEvidenceFiles,
      stationCode: document.getElementById('stationCode').value,
      priority: document.getElementById('complaintPriority') ? document.getElementById('complaintPriority').value : 'Medium',
      declarationAccepted: true
    };

    const res = await ApiService.apiCreateComplaint(payload);

    if (res.success) {
      App.showToast('Complaint Filed', `Complaint ID ${res.complaintId} has been successfully recorded.`, 'success');
      setTimeout(() => {
        window.location.href = `complaint-details.html?id=${res.complaintId}&registered=true`;
      }, 1000);
    } else {
      App.showToast('Error', res.message || 'Failed to file complaint.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Formal Complaint';
      }
    }
  },

  /**
   * Initialize Complaint History Page (complaint-history.html)
   */
  async initComplaintHistory() {
    const user = AuthService.requireAuth(['citizen']);
    if (!user) return;

    const complaintsListEl = document.getElementById('complaintsList');
    const searchInput = document.getElementById('searchComplaint');
    const statusFilter = document.getElementById('filterStatus');
    const categoryFilter = document.getElementById('filterCategory');
    const sortSelect = document.getElementById('sortOrder');

    const render = async () => {
      const filters = {
        userId: user.id,
        status: statusFilter ? statusFilter.value : 'All',
        crimeCategory: categoryFilter ? categoryFilter.value : 'All',
        search: searchInput ? searchInput.value.trim() : ''
      };

      const res = await ApiService.apiGetComplaints(filters);
      let list = res.data || [];

      // Sort
      if (sortSelect && sortSelect.value === 'oldest') {
        list.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
      } else {
        list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      }

      if (list.length === 0) {
        complaintsListEl.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <h4 class="empty-state-title">No complaints found</h4>
            <p class="empty-state-desc">You have no complaints matching the current criteria. To lodge an incident, use the Report Crime portal.</p>
            <a href="report-crime.html" class="btn btn-primary">Report a Crime</a>
          </div>
        `;
        return;
      }

      complaintsListEl.innerHTML = `
        <div class="table-responsive">
          <table class="crs-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Crime Category</th>
                <th>Incident Date</th>
                <th>Location</th>
                <th>Assigned Station</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(c => `
                <tr>
                  <td><span class="crs-table-code">${c.id}</span></td>
                  <td><strong>${c.crimeCategory}</strong></td>
                  <td>${App.formatDate(c.incidentDate)}</td>
                  <td>${c.location}, ${c.district}</td>
                  <td>${c.stationName || c.stationCode}</td>
                  <td>${App.renderStatusBadge(c.status)}</td>
                  <td>
                    <a href="complaint-details.html?id=${c.id}" class="btn btn-sm btn-outline-primary">
                      View Details
                    </a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    };

    if (searchInput) searchInput.addEventListener('input', render);
    if (statusFilter) statusFilter.addEventListener('change', render);
    if (categoryFilter) categoryFilter.addEventListener('change', render);
    if (sortSelect) sortSelect.addEventListener('change', render);

    await render();
  },

  /**
   * Initialize Complaint Details Page (complaint-details.html?id=...)
   */
  async initComplaintDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const complaintId = urlParams.get('id');

    if (!complaintId) {
      document.getElementById('complaintDetailsContainer').innerHTML = `
        <div class="alert alert-danger">
          <div class="alert-content">
            <h4 class="alert-title">Missing Complaint ID</h4>
            <p>No complaint identifier was provided in the URL. Please return to your complaint history.</p>
          </div>
        </div>
        <a href="complaint-history.html" class="btn btn-secondary">Back to History</a>
      `;
      return;
    }

    const res = await ApiService.apiGetComplaintById(complaintId);
    if (!res.success) {
      document.getElementById('complaintDetailsContainer').innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon text-emergency">
            <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <h4 class="empty-state-title">Complaint Not Found</h4>
          <p class="empty-state-desc">${res.message}</p>
          <a href="complaint-history.html" class="btn btn-secondary">Return to History</a>
        </div>
      `;
      return;
    }

    const c = res.data;

    // Render Full Complaint Summary
    const container = document.getElementById('complaintDetailsContainer');
    container.innerHTML = `
      <div class="dashboard-page-header">
        <div>
          <div class="flex items-center gap-3">
            <h2 class="dashboard-page-title">${c.id}</h2>
            ${App.renderStatusBadge(c.status)}
          </div>
          <p class="dashboard-page-subtitle">Submitted on ${App.formatDateTime(c.submittedAt)} • Station: ${c.stationName || c.stationCode}</p>
        </div>
        <div class="flex gap-2 no-print">
          <button type="button" class="btn btn-outline" onclick="window.print()">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print Case Summary
          </button>
          <a href="track-complaint.html?id=${c.id}" class="btn btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            Track Status Timeline
          </a>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6 mb-6">
        <!-- Main Case Data -->
        <div class="card" style="grid-column: span 2;">
          <div class="card-header">
            <h3 class="card-title">Incident Particulars</h3>
            <span class="badge badge-submitted">${c.crimeCategory}</span>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span class="text-muted font-semibold" style="font-size: 0.75rem; text-transform: uppercase;">Incident Date & Time</span>
                <p class="font-bold">${App.formatDate(c.incidentDate)} at ${c.incidentTime}</p>
              </div>
              <div>
                <span class="text-muted font-semibold" style="font-size: 0.75rem; text-transform: uppercase;">Jurisdictional Station</span>
                <p class="font-bold">${c.stationName || c.stationCode} (${c.district})</p>
              </div>
              <div>
                <span class="text-muted font-semibold" style="font-size: 0.75rem; text-transform: uppercase;">Location / Address</span>
                <p class="font-bold">${c.location}, ${c.city}, ${c.state}</p>
              </div>
              <div>
                <span class="text-muted font-semibold" style="font-size: 0.75rem; text-transform: uppercase;">Investigating Officer</span>
                <p class="font-bold text-primary">${c.assignedOfficerName || 'Pending Assignment'}</p>
              </div>
            </div>

            <div class="mb-6">
              <span class="text-muted font-semibold" style="font-size: 0.75rem; text-transform: uppercase;">Incident Description</span>
              <div style="background: var(--color-bg-light); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem; margin-top: 0.35rem; line-height: 1.6;">
                ${c.description}
              </div>
            </div>

            <!-- Suspect Details -->
            <div class="mb-4">
              <h4 class="font-bold mb-2">Suspect Information</h4>
              <div class="grid grid-cols-2 gap-3" style="background: #fafaf9; border: 1px solid var(--color-border); padding: 1rem; border-radius: var(--radius-md);">
                <div><strong>Identified Name:</strong> ${c.suspect?.name || 'Unknown'}</div>
                <div><strong>Vehicle No:</strong> ${c.suspect?.vehicleNo || 'N/A'}</div>
                <div style="grid-column: span 2;"><strong>Description:</strong> ${c.suspect?.description || 'N/A'}</div>
                <div style="grid-column: span 2;"><strong>Additional Notes:</strong> ${c.suspect?.additionalInfo || 'None'}</div>
              </div>
            </div>

            <!-- Evidence Attachments -->
            <div>
              <h4 class="font-bold mb-2">Documented Evidence (${c.evidence ? c.evidence.length : 0})</h4>
              ${c.evidence && c.evidence.length > 0 ? `
                <div class="file-preview-list">
                  ${c.evidence.map(ev => `
                    <div class="file-preview-item">
                      <div class="file-info">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                        <span class="file-name">${ev.name}</span>
                        <span class="file-size">(${ev.size})</span>
                      </div>
                      <span class="badge badge-verified">Verified Metadata</span>
                    </div>
                  `).join('')}
                </div>
              ` : '<p class="text-muted font-size-xs">No media or digital files attached to this complaint.</p>'}
            </div>
          </div>
        </div>

        <!-- Right Side: Complainant & Official Timeline -->
        <div class="flex flex-col gap-6">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">Complainant Profile</h4>
            </div>
            <div class="card-body">
              <div class="flex items-center gap-3 mb-4">
                <div class="sidebar-user-avatar" style="width: 44px; height: 44px;">
                  ${c.complainantName ? c.complainantName[0] : 'C'}
                </div>
                <div>
                  <h4 class="font-bold">${c.complainantName}</h4>
                  <span class="badge badge-role-citizen">Registered Citizen</span>
                </div>
              </div>
              <div style="font-size: 0.85rem; line-height: 1.8;">
                <div><strong>Mobile:</strong> ${c.complainantMobile}</div>
                <div><strong>Email:</strong> ${c.complainantEmail}</div>
                <div><strong>Jurisdiction:</strong> ${c.district}</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h4 class="card-title">Investigation Diary</h4>
            </div>
            <div class="card-body">
              <div class="timeline">
                ${(c.timeline || []).map((tl, i) => `
                  <div class="timeline-item ${i === (c.timeline.length - 1) ? 'active' : 'completed'}">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <span class="timeline-title">${tl.status}</span>
                        <span class="timeline-date">${App.formatDate(tl.date)}</span>
                      </div>
                      <div class="timeline-body">${tl.notes}</div>
                      <div class="text-muted font-semibold mt-1" style="font-size: 0.7rem;">Officer: ${tl.officer}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Initialize Public & Citizen Track Complaint Page (track-complaint.html)
   */
  async initTrackComplaint() {
    const searchForm = document.getElementById('trackSearchForm');
    const input = document.getElementById('trackComplaintId');
    const resultContainer = document.getElementById('trackResultContainer');

    const handleSearch = async (id) => {
      if (!id || id.trim() === '') {
        App.showToast('Input Required', 'Please enter a valid Complaint ID.', 'error');
        return;
      }

      resultContainer.innerHTML = '<div class="py-12 text-center text-muted">Searching central repository...</div>';

      const res = await ApiService.apiGetComplaintById(id.trim());

      if (!res.success) {
        resultContainer.innerHTML = `
          <div class="card" style="border-color: var(--color-emergency-border);">
            <div class="card-body text-center py-8">
              <div class="emergency-icon-pulse" style="margin: 0 auto 1rem;">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </div>
              <h3 class="font-bold text-emergency mb-1">Complaint Record Not Found</h3>
              <p class="text-muted" style="max-width: 480px; margin: 0 auto 1.5rem;">
                The identifier "<strong>${id.trim()}</strong>" does not match any registered case in the central crime repository. Please verify the ID or contact your station.
              </p>
              <a href="contact.html" class="btn btn-outline">Contact Station Support</a>
            </div>
          </div>
        `;
        return;
      }

      const c = res.data;
      const stages = ['Submitted', 'Verified', 'Assigned', 'Investigation', 'Resolved', 'Closed'];
      const currentIdx = stages.findIndex(s => s.toLowerCase() === (c.status || '').toLowerCase());
      const progressPercent = currentIdx >= 0 ? (currentIdx / (stages.length - 1)) * 100 : 0;

      resultContainer.innerHTML = `
        <div class="card card-elevated">
          <div class="card-header">
            <div>
              <span class="text-muted font-semibold" style="font-size: 0.75rem; text-transform: uppercase;">Official Registry Tracking</span>
              <h3 class="card-title font-mono">${c.id}</h3>
            </div>
            ${App.renderStatusBadge(c.status)}
          </div>
          <div class="card-body">
            <!-- Animated Stage Progression Tracker -->
            <div class="track-stepper">
              <div class="track-stepper-progress" style="width: ${progressPercent}%;"></div>
              ${stages.map((st, idx) => {
                let stateClass = '';
                if (idx < currentIdx) stateClass = 'done';
                else if (idx === currentIdx) stateClass = 'current';

                return `
                  <div class="track-step ${stateClass}">
                    <div class="track-step-circle">
                      ${idx < currentIdx ? '✓' : (idx + 1)}
                    </div>
                    <div class="track-step-title">${st}</div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Case Quick Snapshot Grid -->
            <div class="grid grid-cols-4 gap-4 mt-8 py-4" style="background: var(--color-bg-light); border-radius: var(--radius-lg); padding: 1.25rem; border: 1px solid var(--color-border);">
              <div>
                <span class="text-muted font-semibold" style="font-size: 0.75rem;">CRIME CATEGORY</span>
                <p class="font-bold">${c.crimeCategory}</p>
              </div>
              <div>
                <span class="text-muted font-semibold" style="font-size: 0.75rem;">STATION</span>
                <p class="font-bold">${c.stationName || c.stationCode}</p>
              </div>
              <div>
                <span class="text-muted font-semibold" style="font-size: 0.75rem;">ASSIGNED OFFICER</span>
                <p class="font-bold text-primary">${c.assignedOfficerName || 'Under Review'}</p>
              </div>
              <div>
                <span class="text-muted font-semibold" style="font-size: 0.75rem;">LAST UPDATED</span>
                <p class="font-bold">${App.formatDateTime(c.lastUpdated)}</p>
              </div>
            </div>

            <!-- Detailed Case Timeline -->
            <h4 class="font-bold mt-8 mb-4">Official Activity & Audit Log</h4>
            <div class="timeline">
              ${(c.timeline || []).map((tl, i) => `
                <div class="timeline-item ${i === (c.timeline.length - 1) ? 'active' : 'completed'}">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <span class="timeline-title">${tl.status}</span>
                      <span class="timeline-date">${App.formatDateTime(tl.date)}</span>
                    </div>
                    <div class="timeline-body">${tl.notes}</div>
                    <div class="text-muted font-semibold mt-1" style="font-size: 0.7rem;">Updated by: ${tl.officer}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="card-footer">
            <span class="text-muted font-size-xs">Electronic Verification Signature • CRS Central Server</span>
            <div class="flex gap-2">
              <a href="complaint-details.html?id=${c.id}" class="btn btn-sm btn-primary">Full Dossier</a>
            </div>
          </div>
        </div>
      `;
    };

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSearch(input.value);
      });
    }

    // Auto-search if ?id= query parameter is present
    const urlParams = new URLSearchParams(window.location.search);
    const prefillId = urlParams.get('id');
    if (prefillId) {
      if (input) input.value = prefillId;
      handleSearch(prefillId);
    }
  }
};
