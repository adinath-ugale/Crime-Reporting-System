/**
 * CRIME REPORTING SYSTEM (CRS) - INITIAL SEED DATA
 * Realistic civic dataset initialized into LocalStorage if empty.
 * Note: Initial civic seed dataset for system initialization.
 */

const CRS_INITIAL_DATA = {
  stations: [
    {
      id: "ST-101",
      code: "CPS-01",
      name: "Central Police Station",
      district: "Central District",
      city: "Metro City",
      state: "Maharashtra",
      pincode: "400001",
      contact: "022-22620111",
      email: "central.ps@crs.gov.in",
      inCharge: "Inspector R. K. Sharma",
      status: "Active",
      totalPersonnel: 48,
      address: "Civic Square, MG Road, Fort"
    },
    {
      id: "ST-102",
      code: "CCU-02",
      name: "Cyber Crime Unit HQ",
      district: "IT Corridor",
      city: "Metro City",
      state: "Maharashtra",
      pincode: "400051",
      contact: "022-26590222",
      email: "cybercrime@crs.gov.in",
      inCharge: "ACP Priya Deshmukh",
      status: "Active",
      totalPersonnel: 32,
      address: "Cyber Cell Towers, BKC Complex"
    },
    {
      id: "ST-103",
      code: "NPS-03",
      name: "North Metro Police Station",
      district: "North District",
      city: "Metro City",
      state: "Maharashtra",
      pincode: "400092",
      contact: "022-28910333",
      email: "northmetro.ps@crs.gov.in",
      inCharge: "Inspector Vikram Patil",
      status: "Active",
      totalPersonnel: 40,
      address: "Sector 4, Link Road, Borivali"
    },
    {
      id: "ST-104",
      code: "SPS-04",
      name: "South Coastal Police Station",
      district: "South District",
      city: "Metro City",
      state: "Maharashtra",
      pincode: "400005",
      contact: "022-22180444",
      email: "southcoastal.ps@crs.gov.in",
      inCharge: "Inspector Anand Verma",
      status: "Active",
      totalPersonnel: 36,
      address: "Harbor Marine Drive, Colaba"
    }
  ],

  officers: [
    {
      id: "OFF-201",
      policeId: "POL-7821",
      name: "Inspector R. K. Sharma",
      rank: "Inspector of Police",
      stationCode: "CPS-01",
      stationName: "Central Police Station",
      district: "Central District",
      email: "rsharma.pol@crs.gov.in",
      mobile: "9820112233",
      casesAssigned: 5,
      status: "On Duty"
    },
    {
      id: "OFF-202",
      policeId: "POL-8419",
      name: "Sub-Inspector Arjun Naik",
      rank: "Sub-Inspector",
      stationCode: "CPS-01",
      stationName: "Central Police Station",
      district: "Central District",
      email: "anaik.pol@crs.gov.in",
      mobile: "9820223344",
      casesAssigned: 3,
      status: "On Duty"
    },
    {
      id: "OFF-203",
      policeId: "POL-9102",
      name: "ACP Priya Deshmukh",
      rank: "Assistant Commissioner",
      stationCode: "CCU-02",
      stationName: "Cyber Crime Unit HQ",
      district: "IT Corridor",
      email: "pdeshmukh.pol@crs.gov.in",
      mobile: "9820334455",
      casesAssigned: 2,
      status: "On Duty"
    },
    {
      id: "OFF-204",
      policeId: "POL-6531",
      name: "Sub-Inspector Kavita Joshi",
      rank: "Sub-Inspector",
      stationCode: "CCU-02",
      stationName: "Cyber Crime Unit HQ",
      district: "IT Corridor",
      email: "kjoshi.pol@crs.gov.in",
      mobile: "9820445566",
      casesAssigned: 4,
      status: "On Duty"
    },
    {
      id: "OFF-205",
      policeId: "POL-5120",
      name: "Inspector Vikram Patil",
      rank: "Inspector of Police",
      stationCode: "NPS-03",
      stationName: "North Metro Police Station",
      district: "North District",
      email: "vpatil.pol@crs.gov.in",
      mobile: "9820556677",
      casesAssigned: 3,
      status: "On Duty"
    },
    {
      id: "OFF-206",
      policeId: "POL-3914",
      name: "Inspector Anand Verma",
      rank: "Inspector of Police",
      stationCode: "SPS-04",
      stationName: "South Coastal Police Station",
      district: "South District",
      email: "averma.pol@crs.gov.in",
      mobile: "9820667788",
      casesAssigned: 2,
      status: "On Duty"
    }
  ],

  users: [
    {
      id: "USR-001",
      fullName: "Aditya S. Kulkarni",
      email: "citizen@crs.gov.in",
      mobile: "9876543210",
      password: "Password@123",
      role: "citizen",
      address: "Flat 402, Green Meadows, Senapati Bapat Marg",
      city: "Metro City",
      district: "Central District",
      state: "Maharashtra",
      pincode: "400013",
      createdAt: "2026-08-10T10:30:00.000Z"
    },
    {
      id: "USR-002",
      fullName: "Inspector R. K. Sharma",
      email: "police@crs.gov.in",
      mobile: "9820112233",
      policeId: "POL-7821",
      stationCode: "CPS-01",
      password: "Police@123",
      role: "police",
      rank: "Inspector of Police",
      district: "Central District",
      city: "Metro City",
      createdAt: "2026-07-01T09:00:00.000Z"
    },
    {
      id: "USR-003",
      fullName: "ACP Priya Deshmukh",
      email: "incharge@crs.gov.in",
      mobile: "9820334455",
      policeId: "POL-9102",
      stationCode: "CCU-02",
      password: "Incharge@123",
      role: "incharge",
      rank: "Station In-Charge",
      district: "IT Corridor",
      city: "Metro City",
      createdAt: "2026-06-15T09:00:00.000Z"
    },
    {
      id: "USR-004",
      fullName: "Director General D. N. Kapoor",
      email: "official@crs.gov.in",
      mobile: "9899001122",
      policeId: "HQ-001",
      stationCode: "HQ-STATE",
      password: "Official@123",
      role: "official",
      rank: "Director General / State Commissioner",
      district: "State Headquarters",
      city: "Metro City",
      createdAt: "2026-05-01T09:00:00.000Z"
    }
  ],

  complaints: [
    {
      id: "CRS-2026-10492",
      userId: "USR-001",
      complainantName: "Aditya S. Kulkarni",
      complainantMobile: "9876543210",
      complainantEmail: "citizen@crs.gov.in",
      crimeCategory: "Theft",
      incidentDate: "2026-09-18",
      incidentTime: "19:45",
      location: "Metro Station Parking Lot, Gate 2",
      city: "Metro City",
      district: "Central District",
      state: "Maharashtra",
      description: "My two-wheeler motorcycle (Registration MH-01-AB-4592) was stolen from the Metro station parking lot between 7:30 PM and 8:15 PM. The vehicle was locked with handlebar lock.",
      suspect: {
        name: "Unknown Male",
        description: "Wearing dark blue hooded jacket and helmet, approximately 5ft 9in height",
        vehicleNo: "N/A",
        additionalInfo: "CCTV camera #4 on the pole directly faces the parking entrance"
      },
      evidence: [
        { name: "Parking_Receipt_18Sep.pdf", size: "245 KB", type: "application/pdf" },
        { name: "CCTV_Frame_Reference.jpg", size: "1.2 MB", type: "image/jpeg" }
      ],
      stationCode: "CPS-01",
      stationName: "Central Police Station",
      assignedOfficerId: "POL-8419",
      assignedOfficerName: "Sub-Inspector Arjun Naik",
      status: "Investigation",
      priority: "Medium",
      declarationAccepted: true,
      submittedAt: "2026-09-19T09:15:00.000Z",
      lastUpdated: "2026-09-22T14:30:00.000Z",
      timeline: [
        {
          status: "Submitted",
          date: "2026-09-19T09:15:00.000Z",
          officer: "System Auto-Registered",
          notes: "Complaint filed online by citizen and verified via registered credential."
        },
        {
          status: "Verified",
          date: "2026-09-19T11:40:00.000Z",
          officer: "Inspector R. K. Sharma",
          notes: "Preliminary facts verified against local dispatch log. Jurisdiction confirmed at Central PS."
        },
        {
          status: "Assigned",
          date: "2026-09-20T10:00:00.000Z",
          officer: "Inspector R. K. Sharma",
          notes: "Assigned to Sub-Inspector Arjun Naik for field inspection and CCTV requisition."
        },
        {
          status: "Investigation",
          date: "2026-09-22T14:30:00.000Z",
          officer: "Sub-Inspector Arjun Naik",
          notes: "Metro CCTV surveillance footage obtained. Suspect vehicle track identified on Ring Road."
        }
      ]
    },
    {
      id: "CRS-2026-10385",
      userId: "USR-001",
      complainantName: "Aditya S. Kulkarni",
      complainantMobile: "9876543210",
      complainantEmail: "citizen@crs.gov.in",
      crimeCategory: "Cyber Crime",
      incidentDate: "2026-09-05",
      incidentTime: "14:10",
      location: "Online / Bank Netbanking Transaction",
      city: "Metro City",
      district: "IT Corridor",
      state: "Maharashtra",
      description: "Received a fraudulent SMS posing as electricity bill alert. Clicked the APK link and ₹35,000 was debited in two unauthorized transactions via UPI.",
      suspect: {
        name: "Cyber Syndicate / Fraudulent UPI ID",
        description: "UPI beneficiary handles: quickbill98@okaxis and fastpay24@ybl",
        vehicleNo: "N/A",
        additionalInfo: "SMS originated from sender header VK-EBILLP"
      },
      evidence: [
        { name: "Bank_Statement_Fraud_Debit.pdf", size: "480 KB", type: "application/pdf" },
        { name: "Phishing_SMS_Screenshot.png", size: "820 KB", type: "image/png" }
      ],
      stationCode: "CCU-02",
      stationName: "Cyber Crime Unit HQ",
      assignedOfficerId: "POL-6531",
      assignedOfficerName: "Sub-Inspector Kavita Joshi",
      status: "Resolved",
      priority: "High",
      declarationAccepted: true,
      submittedAt: "2026-09-05T16:00:00.000Z",
      lastUpdated: "2026-09-14T11:20:00.000Z",
      timeline: [
        {
          status: "Submitted",
          date: "2026-09-05T16:00:00.000Z",
          officer: "System Auto-Registered",
          notes: "Online cyber complaint registered."
        },
        {
          status: "Verified",
          date: "2026-09-05T17:15:00.000Z",
          officer: "ACP Priya Deshmukh",
          notes: "Bank dispute notice issued immediately to nodal banking security."
        },
        {
          status: "Assigned",
          date: "2026-09-06T09:30:00.000Z",
          officer: "ACP Priya Deshmukh",
          notes: "Assigned to Sub-Inspector Kavita Joshi."
        },
        {
          status: "Investigation",
          date: "2026-09-08T15:00:00.000Z",
          officer: "Sub-Inspector Kavita Joshi",
          notes: "Recipient accounts frozen via Cyber Financial Fraud Reporting System (CFCFRMS)."
        },
        {
          status: "Resolved",
          date: "2026-09-14T11:20:00.000Z",
          officer: "Sub-Inspector Kavita Joshi",
          notes: "Full refund of ₹35,000 reversed to complainant's original savings account. Fraudulent UPI blocked."
        }
      ]
    },
    {
      id: "CRS-2026-10214",
      userId: "USR-001",
      complainantName: "Aditya S. Kulkarni",
      complainantMobile: "9876543210",
      complainantEmail: "citizen@crs.gov.in",
      crimeCategory: "Harassment",
      incidentDate: "2026-08-25",
      incidentTime: "21:00",
      location: "Commercial Complex Wing B",
      city: "Metro City",
      district: "North District",
      state: "Maharashtra",
      description: "Repeated verbal intimidation and threatening calls from an unauthorized recovery agent demanding illegal commission.",
      suspect: {
        name: "Unknown Caller calling from 9892XXXX11",
        description: "Male voice claiming to represent instant loan app agency",
        vehicleNo: "N/A",
        additionalInfo: "Call recordings saved"
      },
      evidence: [
        { name: "Call_Logs_Threats.pdf", size: "180 KB", type: "application/pdf" }
      ],
      stationCode: "NPS-03",
      stationName: "North Metro Police Station",
      assignedOfficerId: "POL-5120",
      assignedOfficerName: "Inspector Vikram Patil",
      status: "Closed",
      priority: "Medium",
      declarationAccepted: true,
      submittedAt: "2026-08-26T10:00:00.000Z",
      lastUpdated: "2026-09-02T16:00:00.000Z",
      timeline: [
        {
          status: "Submitted",
          date: "2026-08-26T10:00:00.000Z",
          officer: "System Auto-Registered",
          notes: "Complaint logged."
        },
        {
          status: "Verified",
          date: "2026-08-26T12:00:00.000Z",
          officer: "Inspector Vikram Patil",
          notes: "Phone numbers traced to fraudulent agency."
        },
        {
          status: "Investigation",
          date: "2026-08-28T14:00:00.000Z",
          officer: "Inspector Vikram Patil",
          notes: "Legal warning issued under Section 506 IPC. Call ceased."
        },
        {
          status: "Resolved",
          date: "2026-09-01T11:00:00.000Z",
          officer: "Inspector Vikram Patil",
          notes: "Complainant verified harassment stopped completely."
        },
        {
          status: "Closed",
          date: "2026-09-02T16:00:00.000Z",
          officer: "Inspector Vikram Patil",
          notes: "Case closed with citizen satisfaction acknowledgment."
        }
      ]
    },
    {
      id: "CRS-2026-10518",
      userId: "USR-005",
      complainantName: "Meera R. Deshpande",
      complainantMobile: "9819876543",
      complainantEmail: "m.deshpande@samplecivic.org",
      crimeCategory: "Robbery",
      incidentDate: "2026-09-24",
      incidentTime: "22:15",
      location: "Near City Garden Foot overbridge",
      city: "Metro City",
      district: "South District",
      state: "Maharashtra",
      description: "Gold chain snatched while walking near garden gate by two individuals on a black motorcycle without number plate.",
      suspect: {
        name: "Two unidentified suspects",
        description: "Rider wearing black jacket; pillion wearing red t-shirt and white cap",
        vehicleNo: "Number plate concealed with mud",
        additionalInfo: "Fled towards highway connector"
      },
      evidence: [
        { name: "Spot_Photo_Garden_Gate.jpg", size: "1.8 MB", type: "image/jpeg" }
      ],
      stationCode: "SPS-04",
      stationName: "South Coastal Police Station",
      assignedOfficerId: "POL-3914",
      assignedOfficerName: "Inspector Anand Verma",
      status: "Submitted",
      priority: "High",
      declarationAccepted: true,
      submittedAt: "2026-09-25T08:30:00.000Z",
      lastUpdated: "2026-09-25T08:30:00.000Z",
      timeline: [
        {
          status: "Submitted",
          date: "2026-09-25T08:30:00.000Z",
          officer: "System Auto-Registered",
          notes: "High priority robbery complaint received."
        }
      ]
    }
  ],

  investigations: [
    {
      id: "INV-501",
      complaintId: "CRS-2026-10492",
      officerId: "POL-8419",
      officerName: "Sub-Inspector Arjun Naik",
      date: "2026-09-22T14:30:00.000Z",
      actionTaken: "Obtained DVR footage from Metro authority. Verified license plate scanner data for egress corridor.",
      evidenceStatus: "CCTV clips verified and stored in digital evidence locker",
      nextAction: "Interrogate suspect vehicle owner registered under matching chassis sequence.",
      notes: "Clear image of pillion suspect secured from camera #04."
    },
    {
      id: "INV-502",
      complaintId: "CRS-2026-10385",
      officerId: "POL-6531",
      officerName: "Sub-Inspector Kavita Joshi",
      date: "2026-09-08T15:00:00.000Z",
      actionTaken: "Issued freezing notice under Section 91 CrPC to payment aggregator bank gateway.",
      evidenceStatus: "Audit trail log from payment gateway downloaded",
      nextAction: "File account freeze compliance report and credit reversal request.",
      notes: "Beneficiary bank confirmed balance holds adequate recovery amounts."
    }
  ],

  notifications: [
    {
      id: "NOTIF-001",
      userId: "USR-001",
      role: "citizen",
      complaintId: "CRS-2026-10492",
      title: "Case Status Updated: Investigation Underway",
      message: "Your complaint CRS-2026-10492 has moved to Investigation stage. Sub-Inspector Arjun Naik has logged initial CCTV review.",
      read: false,
      timestamp: "2026-09-22T14:30:00.000Z"
    },
    {
      id: "NOTIF-002",
      userId: "USR-001",
      role: "citizen",
      complaintId: "CRS-2026-10385",
      title: "Case Resolved Successfully",
      message: "Complaint CRS-2026-10385 regarding Cyber Fraud has been marked as Resolved. Total ₹35,000 refund processed.",
      read: true,
      timestamp: "2026-09-14T11:20:00.000Z"
    },
    {
      id: "NOTIF-003",
      userId: "USR-002",
      role: "police",
      complaintId: "CRS-2026-10518",
      title: "New High Priority Case Reported",
      message: "Complaint CRS-2026-10518 (Robbery) filed at South Coastal Station. Awaiting assignment.",
      read: false,
      timestamp: "2026-09-25T08:35:00.000Z"
    }
  ],

  contacts: [
    {
      id: "CON-001",
      name: "Rohit Bansal",
      email: "rohit.b@civicmail.com",
      phone: "9820098200",
      subject: "Station Inquiry",
      message: "Want to know the jurisdiction boundary for Sector 5 Metro Station.",
      submittedAt: "2026-09-20T11:00:00.000Z"
    }
  ]
};
