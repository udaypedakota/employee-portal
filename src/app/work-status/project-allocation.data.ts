export interface ProjectAllocation {
  employeeId: string;
  employeeName: string;
  project: string;
  role: string;
  startDate: string;
  endDate: string;
}

export const PROJECT_ALLOCATIONS: ProjectAllocation[] = [
  { employeeId: 'CBHYD604', employeeName: 'Vaddi Navya Sree', project: 'DCT - Digital Cooperative Transformation', role: 'Full-stack Developer', startDate: '2025-01-15', endDate: '2025-12-31' },
  { employeeId: 'CBHYD605', employeeName: 'Yarlanki Siva Kumar', project: 'ERP - Enterprise Resource Planning', role: 'Full-stack Developer', startDate: '2025-02-01', endDate: '2025-11-30' },
  { employeeId: 'CBHYD621', employeeName: 'Thakkallapalli Phanidher', project: 'CoopsIndia - National Portal', role: 'Full-stack Developer', startDate: '2025-01-10', endDate: '2025-10-31' },
  { employeeId: 'CBHYD626', employeeName: 'Bora Kiran Kumar', project: 'Insight - Desktop Application', role: 'Full-stack Developer', startDate: '2025-03-01', endDate: '2025-09-30' },
  { employeeId: 'CBHYD627', employeeName: 'Aravind Gundu', project: 'CoopsIndia - PostgreSQL Migration', role: 'Full-stack Developer', startDate: '2025-02-15', endDate: '2025-08-31' },
  { employeeId: 'CBHYD628', employeeName: 'Pedakota Uday Kumar', project: 'TIHCL - Tamil Nadu Cooperative', role: 'Full-stack Developer', startDate: '2025-01-20', endDate: '2025-12-15' },
  { employeeId: 'CBHYD629', employeeName: 'Tankala Tirupati Raju', project: 'FHR - Financial Health Reports', role: 'Full-stack Developer', startDate: '2025-02-10', endDate: '2025-10-20' },
  { employeeId: 'CBHYD631', employeeName: 'Mamidi Nani', project: 'ERP - NCD Integration Services', role: 'Full-stack Developer', startDate: '2025-01-25', endDate: '2025-11-15' },
  { employeeId: 'CBHYD640', employeeName: 'Karthik Jakkula', project: 'FHR - PACS DCT Data Mapping', role: 'Full-stack Developer', startDate: '2025-01-05', endDate: '2025-09-30' },
  { employeeId: 'CBHYD642', employeeName: 'Siddi Amulya', project: 'TIHCL - Microservices Architecture', role: 'Full-stack Developer', startDate: '2025-02-20', endDate: '2025-12-31' },
  { employeeId: 'CBHYD643', employeeName: 'Dilip Kumar Gurijala', project: 'ERP - Mobile Application Services', role: 'Full-stack Developer', startDate: '2025-03-01', endDate: '2025-10-31' },
  { employeeId: 'CBHYD644', employeeName: 'Kotturu Saikumar', project: 'DCT - iText PDF Reports', role: 'Full-stack Developer', startDate: '2025-01-15', endDate: '2025-08-30' },
  { employeeId: 'CBHYD645', employeeName: 'Gedela Dileep Kumar', project: 'ERP - Kafka Event Streaming', role: 'Full-stack Developer', startDate: '2025-02-05', endDate: '2025-11-30' },
  { employeeId: 'CBHYD646', employeeName: 'Laxmi Prasanna Kumar S', project: 'DCT-ERP Migration', role: 'Full-stack Developer', startDate: '2025-01-10', endDate: '2025-09-15' },
  { employeeId: 'CBHYD647', employeeName: 'Bagadi Jogarao', project: 'ARDB-DCT Migration Scripts', role: 'Full-stack Developer', startDate: '2025-03-10', endDate: '2025-10-31' },
  { employeeId: 'CBHYD648', employeeName: 'Sahukari Praveen Chowdary', project: 'ERP - Jenkins CI/CD Pipeline', role: 'Full-stack Developer', startDate: '2025-02-01', endDate: '2025-12-31' },
  { employeeId: 'CBHYD649', employeeName: 'Korla Ramu', project: 'DCT - Shell Script Automation', role: 'Full-stack Developer', startDate: '2025-01-20', endDate: '2025-08-31' },
  { employeeId: 'CBHYD650', employeeName: 'Bhavana Maddamsetty', project: 'ARDB - JUnit Testing Framework', role: 'Full-stack Developer', startDate: '2025-02-15', endDate: '2025-10-15' },
  { employeeId: 'CBHYD655', employeeName: 'Malla Akhila', project: 'ERP - MSSQL Data Validation', role: 'Full-stack Developer', startDate: '2025-01-25', endDate: '2025-09-30' },
  { employeeId: 'CBHYD656', employeeName: 'Kallepilli Yamuna', project: 'DCT - Oracle DB Integration', role: 'Full-stack Developer', startDate: '2025-02-10', endDate: '2025-11-20' },
  { employeeId: 'CBHYD680', employeeName: 'Kusuma', project: 'ERP - Regression Testing Suite', role: 'Tester', startDate: '2025-01-15', endDate: '2025-12-31' },
  { employeeId: 'CBHYD681', employeeName: 'Sandhya', project: 'DCT - UAT Test Cases', role: 'Tester', startDate: '2025-02-01', endDate: '2025-10-31' },
  { employeeId: 'CBHYD682', employeeName: 'Mudhukar', project: 'TIHCL - Bug Tracking & Reporting', role: 'Tester', startDate: '2025-03-01', endDate: '2025-11-30' },
  { employeeId: 'CBHYD638', employeeName: 'Talluri Prudhvi', project: 'ERP - Automation Test Scripts', role: 'Tester', startDate: '2025-01-20', endDate: '2025-09-30' },
  { employeeId: 'CBHYD652', employeeName: 'Avidi Rajesh', project: 'ARDB-DCT - Manual Test Execution', role: 'Tester', startDate: '2025-02-10', endDate: '2025-08-31' },
  { employeeId: 'CBHYD620', employeeName: 'Degala Sriramamurty', project: 'ERP - UI Wireframes & Figma', role: 'UI/UX Designer', startDate: '2025-01-10', endDate: '2025-12-31' },
  { employeeId: 'CBHYD636', employeeName: 'Chatti Raviteja', project: 'DCT - Photoshop Asset Design', role: 'UI/UX Designer', startDate: '2025-02-01', endDate: '2025-10-31' },
  { employeeId: 'CBHYD367', employeeName: 'Pachiripalli Subhash Bhargav', project: 'FHR - Adobe Illustrator Icons', role: 'UI/UX Designer', startDate: '2025-01-15', endDate: '2025-09-30' },
  { employeeId: 'CBHYD639', employeeName: 'Kodavali Bhargavi', project: 'ERP - Angular Component Library', role: 'UI Developer', startDate: '2025-02-15', endDate: '2025-12-31' },
  { employeeId: 'CBHYD657', employeeName: 'Gayatri Swain', project: 'ERP - React JS Dashboard UI', role: 'UI Developer', startDate: '2025-03-01', endDate: '2025-11-30' },
  { employeeId: 'CBHYD658', employeeName: 'Polaki Krishnaveni', project: 'ERP - Bootstrap Responsive Layout', role: 'UI Developer', startDate: '2025-01-20', endDate: '2025-10-15' },
  { employeeId: 'CBHYD659', employeeName: 'Maramreddy Lakshmi', project: 'ERP - Angular Forms & Validation', role: 'UI Developer', startDate: '2025-02-05', endDate: '2025-09-30' },
  { employeeId: 'CBHYD661', employeeName: 'Srinivas Chintapenta', project: 'ERP - Figma to Angular Conversion', role: 'UI Developer', startDate: '2025-01-25', endDate: '2025-11-15' },
  { employeeId: 'CBHYD653', employeeName: 'Ogirala Vinod Chandra', project: 'Infra Support - Azure Cloud Monitoring', role: 'Network', startDate: '2025-01-01', endDate: '2025-12-31' },
  { employeeId: 'CBHYD662', employeeName: 'Venkatesh Mutyala', project: 'DevOps - Docker & Jenkins Pipeline', role: 'Network', startDate: '2025-01-01', endDate: '2025-12-31' },
];
