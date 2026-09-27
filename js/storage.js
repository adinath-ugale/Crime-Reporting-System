/**
 * CRIME REPORTING SYSTEM (CRS) - STORAGE LAYER
 * Centralized LocalStorage interface with structured keys & seed initialization.
 */

const CRS_STORAGE_KEYS = {
  USERS: 'crs_users',
  COMPLAINTS: 'crs_complaints',
  STATIONS: 'crs_stations',
  OFFICERS: 'crs_officers',
  NOTIFICATIONS: 'crs_notifications',
  SESSIONS: 'crs_sessions',
  INVESTIGATIONS: 'crs_investigations',
  CONTACTS: 'crs_contacts'
};

const StorageService = {
  /**
   * Retrieve parsed JSON from localStorage with fallback
   */
  getData(key, defaultValue = []) {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (err) {
      console.error(`Storage error reading key "${key}":`, err);
      return defaultValue;
    }
  },

  /**
   * Save data to localStorage
   */
  saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error(`Storage error saving key "${key}":`, err);
      return false;
    }
  },

  /**
   * Add a single item to a collection
   */
  addItem(key, item) {
    const list = this.getData(key, []);
    list.unshift(item); // new items at top
    this.saveData(key, list);
    return item;
  },

  /**
   * Update an existing item in a collection
   */
  updateItem(key, id, updateFields, idField = 'id') {
    const list = this.getData(key, []);
    let updated = null;
    const newList = list.map(item => {
      if (item[idField] === id) {
        updated = { ...item, ...updateFields, lastUpdated: new Date().toISOString() };
        return updated;
      }
      return item;
    });
    if (updated) {
      this.saveData(key, newList);
    }
    return updated;
  },

  /**
   * Delete an item from a collection
   */
  deleteItem(key, id, idField = 'id') {
    const list = this.getData(key, []);
    const filtered = list.filter(item => item[idField] !== id);
    this.saveData(key, filtered);
    return filtered.length < list.length;
  },

  /**
   * Generate clean formatted IDs e.g. CRS-YYYY-XXXXX
   */
  generateId(prefix = 'CRS') {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digits
    return `${prefix}-${year}-${randomNum}`;
  },

  /**
   * Generate generic short ID
   */
  generateShortId(prefix = 'ID') {
    const random = Math.floor(100 + Math.random() * 900);
    return `${prefix}-${random}`;
  },

  /**
   * Seed default data if localStorage keys do not exist
   */
  initStorage() {
    if (typeof CRS_INITIAL_DATA === 'undefined') {
      console.warn('CRS_INITIAL_DATA is not defined. Skipping seed initialization.');
      return;
    }

    if (!localStorage.getItem(CRS_STORAGE_KEYS.USERS)) {
      this.saveData(CRS_STORAGE_KEYS.USERS, CRS_INITIAL_DATA.users);
    }
    if (!localStorage.getItem(CRS_STORAGE_KEYS.COMPLAINTS)) {
      this.saveData(CRS_STORAGE_KEYS.COMPLAINTS, CRS_INITIAL_DATA.complaints);
    }
    if (!localStorage.getItem(CRS_STORAGE_KEYS.STATIONS)) {
      this.saveData(CRS_STORAGE_KEYS.STATIONS, CRS_INITIAL_DATA.stations);
    }
    if (!localStorage.getItem(CRS_STORAGE_KEYS.OFFICERS)) {
      this.saveData(CRS_STORAGE_KEYS.OFFICERS, CRS_INITIAL_DATA.officers);
    }
    if (!localStorage.getItem(CRS_STORAGE_KEYS.NOTIFICATIONS)) {
      this.saveData(CRS_STORAGE_KEYS.NOTIFICATIONS, CRS_INITIAL_DATA.notifications);
    }
    if (!localStorage.getItem(CRS_STORAGE_KEYS.INVESTIGATIONS)) {
      this.saveData(CRS_STORAGE_KEYS.INVESTIGATIONS, CRS_INITIAL_DATA.investigations);
    }
    if (!localStorage.getItem(CRS_STORAGE_KEYS.CONTACTS)) {
      this.saveData(CRS_STORAGE_KEYS.CONTACTS, CRS_INITIAL_DATA.contacts);
    }
  },

  /**
   * Re-seed default dataset (cleans and restores initial state)
   */
  resetToInitial() {
    if (typeof CRS_INITIAL_DATA !== 'undefined') {
      this.saveData(CRS_STORAGE_KEYS.USERS, CRS_INITIAL_DATA.users);
      this.saveData(CRS_STORAGE_KEYS.COMPLAINTS, CRS_INITIAL_DATA.complaints);
      this.saveData(CRS_STORAGE_KEYS.STATIONS, CRS_INITIAL_DATA.stations);
      this.saveData(CRS_STORAGE_KEYS.OFFICERS, CRS_INITIAL_DATA.officers);
      this.saveData(CRS_STORAGE_KEYS.NOTIFICATIONS, CRS_INITIAL_DATA.notifications);
      this.saveData(CRS_STORAGE_KEYS.INVESTIGATIONS, CRS_INITIAL_DATA.investigations);
      this.saveData(CRS_STORAGE_KEYS.CONTACTS, CRS_INITIAL_DATA.contacts);
    }
  }
};

// Initialize on script load
StorageService.initStorage();
