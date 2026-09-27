/**
 * CRIME REPORTING SYSTEM (CRS) - API SERVICE LAYER
 * Abstracts data access behind Promise-based async functions.
 * Currently backed by LocalStorage; ready to swap with PHP/MySQL endpoints
 * (e.g., fetch('/api/login.php'), fetch('/api/complaints.php')) without UI changes.
 */

const ApiService = {
  // Flag indicating backend connection mode (localStorage client persistence vs remote PHP)
  BACKEND_MODE: 'LOCAL_STORAGE', // Switch to 'PHP_API' when PHP backend is mounted

  /**
   * Citizen Login
   */
  async apiLogin(identifier, password) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch('api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      return await res.json();
    }

    // LocalStorage resolution
    const users = StorageService.getData(CRS_STORAGE_KEYS.USERS, []);
    const user = users.find(u => 
      (u.email.toLowerCase() === identifier.trim().toLowerCase() || u.mobile === identifier.trim()) &&
      u.password === password
    );

    if (user) {
      // Don't expose password
      const { password: _, ...userSession } = user;
      return { success: true, user: userSession, message: 'Authentication successful.' };
    }
    return { success: false, message: 'Invalid email/mobile or password.' };
  },

  /**
   * Police / Official Portal Login
   */
  async apiPoliceLogin(policeId, stationCode, password) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch('api/police-login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policeId, stationCode, password })
      });
      return await res.json();
    }

    const users = StorageService.getData(CRS_STORAGE_KEYS.USERS, []);
    const policeUser = users.find(u => 
      (u.role === 'police' || u.role === 'incharge' || u.role === 'official') &&
      u.policeId && u.policeId.toLowerCase() === policeId.trim().toLowerCase() &&
      (!stationCode || (u.stationCode && u.stationCode.toLowerCase() === stationCode.trim().toLowerCase())) &&
      u.password === password
    );

    if (policeUser) {
      const { password: _, ...userSession } = policeUser;
      return { success: true, user: userSession, message: 'Police authorization verified.' };
    }
    return { success: false, message: 'Invalid Police ID, Station Code, or Password.' };
  },

  /**
   * Register Citizen
   */
  async apiRegister(userData) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch('api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await res.json();
    }

    const users = StorageService.getData(CRS_STORAGE_KEYS.USERS, []);
    const existing = users.find(u => 
      u.email.toLowerCase() === userData.email.trim().toLowerCase() || 
      u.mobile === userData.mobile.trim()
    );

    if (existing) {
      return { success: false, message: 'An account with this email or mobile already exists.' };
    }

    const newUser = {
      id: StorageService.generateShortId('USR'),
      fullName: userData.fullName.trim(),
      email: userData.email.trim().toLowerCase(),
      mobile: userData.mobile.trim(),
      password: userData.password,
      role: 'citizen',
      address: userData.address || '',
      city: userData.city || '',
      district: userData.district || '',
      state: userData.state || '',
      pincode: userData.pincode || '',
      createdAt: new Date().toISOString()
    };

    StorageService.addItem(CRS_STORAGE_KEYS.USERS, newUser);

    // Initial welcome notification
    StorageService.addItem(CRS_STORAGE_KEYS.NOTIFICATIONS, {
      id: StorageService.generateShortId('NOTIF'),
      userId: newUser.id,
      role: 'citizen',
      title: 'Welcome to Crime Reporting System',
      message: 'Your citizen identity has been registered securely. You can now file and track complaints online.',
      read: false,
      timestamp: new Date().toISOString()
    });

    return { success: true, user: newUser, message: 'Registration completed successfully.' };
  },

  /**
   * Get Complaints with Filters
   */
  async apiGetComplaints(filters = {}) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`api/complaints.php?${query}`);
      return await res.json();
    }

    let list = StorageService.getData(CRS_STORAGE_KEYS.COMPLAINTS, []);

    if (filters.userId) {
      list = list.filter(c => c.userId === filters.userId);
    }
    if (filters.stationCode) {
      list = list.filter(c => c.stationCode === filters.stationCode);
    }
    if (filters.assignedOfficerId) {
      list = list.filter(c => c.assignedOfficerId === filters.assignedOfficerId);
    }
    if (filters.status && filters.status !== 'All') {
      list = list.filter(c => c.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.crimeCategory && filters.crimeCategory !== 'All') {
      list = list.filter(c => c.crimeCategory.toLowerCase() === filters.crimeCategory.toLowerCase());
    }
    if (filters.district && filters.district !== 'All') {
      list = list.filter(c => c.district.toLowerCase() === filters.district.toLowerCase());
    }
    if (filters.search) {
      const query = filters.search.toLowerCase();
      list = list.filter(c => 
        c.id.toLowerCase().includes(query) ||
        c.crimeCategory.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        (c.complainantName && c.complainantName.toLowerCase().includes(query)) ||
        (c.stationName && c.stationName.toLowerCase().includes(query))
      );
    }

    return { success: true, data: list };
  },

  /**
   * Get Complaint by ID
   */
  async apiGetComplaintById(id) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch(`api/complaints.php?id=${encodeURIComponent(id)}`);
      return await res.json();
    }

    const list = StorageService.getData(CRS_STORAGE_KEYS.COMPLAINTS, []);
    const found = list.find(c => c.id.toUpperCase() === id.trim().toUpperCase());
    if (found) {
      return { success: true, data: found };
    }
    return { success: false, message: `Complaint ID "${id}" was not found in the national registry.` };
  },

  /**
   * Create New Complaint
   */
  async apiCreateComplaint(complaintData) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch('api/complaints.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData)
      });
      return await res.json();
    }

    const complaintId = StorageService.generateId('CRS');
    const nowIso = new Date().toISOString();

    const stations = StorageService.getData(CRS_STORAGE_KEYS.STATIONS, []);
    const matchedStation = stations.find(s => s.code === complaintData.stationCode) || {
      name: 'Jurisdictional Police Station'
    };

    const newComplaint = {
      id: complaintId,
      userId: complaintData.userId,
      complainantName: complaintData.complainantName,
      complainantMobile: complaintData.complainantMobile,
      complainantEmail: complaintData.complainantEmail,
      crimeCategory: complaintData.crimeCategory,
      incidentDate: complaintData.incidentDate,
      incidentTime: complaintData.incidentTime,
      location: complaintData.location,
      city: complaintData.city,
      district: complaintData.district,
      state: complaintData.state,
      description: complaintData.description,
      suspect: complaintData.suspect || { name: 'Unknown', description: 'N/A' },
      evidence: complaintData.evidence || [],
      stationCode: complaintData.stationCode,
      stationName: matchedStation.name,
      assignedOfficerId: null,
      assignedOfficerName: 'Unassigned',
      status: 'Submitted',
      priority: complaintData.priority || 'Medium',
      declarationAccepted: true,
      submittedAt: nowIso,
      lastUpdated: nowIso,
      timeline: [
        {
          status: 'Submitted',
          date: nowIso,
          officer: 'Automated Dispatch',
          notes: 'Complaint filed and registered in the electronic crime repository.'
        }
      ]
    };

    StorageService.addItem(CRS_STORAGE_KEYS.COMPLAINTS, newComplaint);

    // Notify Citizen
    StorageService.addItem(CRS_STORAGE_KEYS.NOTIFICATIONS, {
      id: StorageService.generateShortId('NOTIF'),
      userId: complaintData.userId,
      role: 'citizen',
      complaintId: complaintId,
      title: 'Complaint Registered Successfully',
      message: `Your report has been logged under Complaint ID ${complaintId}. Forwarded to ${matchedStation.name}.`,
      read: false,
      timestamp: nowIso
    });

    // Notify Station Personnel
    StorageService.addItem(CRS_STORAGE_KEYS.NOTIFICATIONS, {
      id: StorageService.generateShortId('NOTIF'),
      userId: 'STATION_' + complaintData.stationCode,
      role: 'police',
      complaintId: complaintId,
      title: `New Case Filed: ${complaintData.crimeCategory}`,
      message: `Complaint ${complaintId} logged for ${complaintData.location}. Awaiting station verification.`,
      read: false,
      timestamp: nowIso
    });

    return { success: true, complaintId, data: newComplaint };
  },

  /**
   * Update Complaint Status & Timeline
   */
  async apiUpdateComplaintStatus(id, newStatus, remarks, officerName, assignedOfficerId = null, assignedOfficerName = null) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch('api/complaints.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, remarks, officerName, assignedOfficerId, assignedOfficerName })
      });
      return await res.json();
    }

    const list = StorageService.getData(CRS_STORAGE_KEYS.COMPLAINTS, []);
    const complaint = list.find(c => c.id === id);
    if (!complaint) {
      return { success: false, message: 'Complaint not found.' };
    }

    const nowIso = new Date().toISOString();
    const updatedTimeline = [...(complaint.timeline || [])];
    
    updatedTimeline.push({
      status: newStatus,
      date: nowIso,
      officer: officerName || 'Duty Officer',
      notes: remarks || `Status transitioned to ${newStatus}.`
    });

    const updateFields = {
      status: newStatus,
      lastUpdated: nowIso,
      timeline: updatedTimeline
    };

    if (assignedOfficerId && assignedOfficerName) {
      updateFields.assignedOfficerId = assignedOfficerId;
      updateFields.assignedOfficerName = assignedOfficerName;
    }

    const updated = StorageService.updateItem(CRS_STORAGE_KEYS.COMPLAINTS, id, updateFields);

    // Notify citizen about status change
    if (complaint.userId) {
      StorageService.addItem(CRS_STORAGE_KEYS.NOTIFICATIONS, {
        id: StorageService.generateShortId('NOTIF'),
        userId: complaint.userId,
        role: 'citizen',
        complaintId: complaint.id,
        title: `Complaint Status Updated: ${newStatus}`,
        message: `Your complaint ${complaint.id} status was updated to "${newStatus}". Remarks: ${remarks || 'None'}`,
        read: false,
        timestamp: nowIso
      });
    }

    return { success: true, data: updated };
  },

  /**
   * Police Stations
   */
  async apiGetStations() {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch('api/stations.php');
      return await res.json();
    }
    const data = StorageService.getData(CRS_STORAGE_KEYS.STATIONS, []);
    return { success: true, data };
  },

  async apiSaveStation(stationData) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch('api/stations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stationData)
      });
      return await res.json();
    }

    if (stationData.id) {
      const updated = StorageService.updateItem(CRS_STORAGE_KEYS.STATIONS, stationData.id, stationData);
      return { success: true, data: updated };
    } else {
      const newStation = {
        ...stationData,
        id: StorageService.generateShortId('ST')
      };
      StorageService.addItem(CRS_STORAGE_KEYS.STATIONS, newStation);
      return { success: true, data: newStation };
    }
  },

  /**
   * Police Officers
   */
  async apiGetOfficers(stationCode = null) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch(`api/officers.php${stationCode ? `?station=${stationCode}` : ''}`);
      return await res.json();
    }
    let data = StorageService.getData(CRS_STORAGE_KEYS.OFFICERS, []);
    if (stationCode) {
      data = data.filter(o => o.stationCode === stationCode);
    }
    return { success: true, data };
  },

  async apiSaveOfficer(officerData) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch('api/officers.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(officerData)
      });
      return await res.json();
    }

    if (officerData.id) {
      const updated = StorageService.updateItem(CRS_STORAGE_KEYS.OFFICERS, officerData.id, officerData);
      return { success: true, data: updated };
    } else {
      const newOfficer = {
        ...officerData,
        id: StorageService.generateShortId('OFF'),
        casesAssigned: 0,
        status: officerData.status || 'On Duty'
      };
      StorageService.addItem(CRS_STORAGE_KEYS.OFFICERS, newOfficer);
      return { success: true, data: newOfficer };
    }
  },

  /**
   * Add Investigation Record
   */
  async apiAddInvestigation(record) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch('api/investigations.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      return await res.json();
    }

    const newRecord = {
      ...record,
      id: StorageService.generateShortId('INV'),
      date: new Date().toISOString()
    };
    StorageService.addItem(CRS_STORAGE_KEYS.INVESTIGATIONS, newRecord);

    // Also update complaint timeline with this investigation entry
    const list = StorageService.getData(CRS_STORAGE_KEYS.COMPLAINTS, []);
    const complaint = list.find(c => c.id === record.complaintId);
    if (complaint) {
      const updatedTimeline = [...(complaint.timeline || [])];
      updatedTimeline.push({
        status: 'Investigation',
        date: newRecord.date,
        officer: record.officerName || 'Investigating Officer',
        notes: `Investigation entry: ${record.actionTaken}. Next step: ${record.nextAction || 'Ongoing enquiry'}`
      });
      StorageService.updateItem(CRS_STORAGE_KEYS.COMPLAINTS, record.complaintId, {
        lastUpdated: newRecord.date,
        timeline: updatedTimeline
      });
    }

    return { success: true, data: newRecord };
  },

  async apiGetInvestigations(complaintId) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch(`api/investigations.php?complaintId=${complaintId}`);
      return await res.json();
    }
    const list = StorageService.getData(CRS_STORAGE_KEYS.INVESTIGATIONS, []);
    const filtered = list.filter(i => i.complaintId === complaintId);
    return { success: true, data: filtered };
  },

  /**
   * Notifications
   */
  async apiGetNotifications(userId, role) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch(`api/notifications.php?userId=${userId}&role=${role}`);
      return await res.json();
    }
    const list = StorageService.getData(CRS_STORAGE_KEYS.NOTIFICATIONS, []);
    const filtered = list.filter(n => n.userId === userId || n.role === role);
    return { success: true, data: filtered };
  },

  async apiMarkNotificationRead(id) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch(`api/notifications.php?id=${id}&action=read`, { method: 'POST' });
      return await res.json();
    }
    const updated = StorageService.updateItem(CRS_STORAGE_KEYS.NOTIFICATIONS, id, { read: true });
    return { success: true, data: updated };
  },

  async apiMarkAllNotificationsRead(userId, role) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch(`api/notifications.php?action=readAll`, { method: 'POST' });
      return await res.json();
    }
    const list = StorageService.getData(CRS_STORAGE_KEYS.NOTIFICATIONS, []);
    const updatedList = list.map(n => {
      if (n.userId === userId || n.role === role) {
        return { ...n, read: true };
      }
      return n;
    });
    StorageService.saveData(CRS_STORAGE_KEYS.NOTIFICATIONS, updatedList);
    return { success: true };
  },

  async apiDeleteNotification(id) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch(`api/notifications.php?id=${id}`, { method: 'DELETE' });
      return await res.json();
    }
    const deleted = StorageService.deleteItem(CRS_STORAGE_KEYS.NOTIFICATIONS, id);
    return { success: deleted };
  },

  /**
   * Save Contact Submission
   */
  async apiSaveContact(contactData) {
    if (this.BACKEND_MODE === 'PHP_API') {
      const res = await fetch('api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      return await res.json();
    }
    const record = {
      ...contactData,
      id: StorageService.generateShortId('CON'),
      submittedAt: new Date().toISOString()
    };
    StorageService.addItem(CRS_STORAGE_KEYS.CONTACTS, record);
    return { success: true, data: record };
  }
};
