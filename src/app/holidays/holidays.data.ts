export interface Holiday {
  date: string;       // YYYY-MM-DD
  name: string;
  type: 'National' | 'Festival' | 'Regional';
  optional: 'Declared' | 'Optional';
}

export const HOLIDAYS_2025: Holiday[] = [
  { date: '2025-01-01', name: 'New Year',              type: 'National',  optional: 'Declared' },
  { date: '2025-01-14', name: 'Bhogi',                 type: 'Festival',  optional: 'Declared' },
  { date: '2025-01-15', name: 'Makara Sankranthi',     type: 'Festival',  optional: 'Declared' },
  { date: '2025-01-26', name: 'Republic Day',          type: 'National',  optional: 'Declared' },
  { date: '2025-03-14', name: 'Maha Sivaratri',        type: 'Festival',  optional: 'Declared' },
  { date: '2025-03-31', name: 'Ugadi',                 type: 'Festival',  optional: 'Declared' },
  { date: '2025-04-10', name: 'Id-ul-Fitr (Ramzan)',   type: 'National',  optional: 'Declared' },
  { date: '2025-04-14', name: 'Dr. Ambedkar Jayanthi', type: 'National',  optional: 'Declared' },
  { date: '2025-04-18', name: 'Good Friday',           type: 'National',  optional: 'Declared' },
  { date: '2025-05-01', name: 'May Day',               type: 'National',  optional: 'Declared' },
  { date: '2025-06-07', name: 'Bakrid (Id-ul-Adha)',   type: 'National',  optional: 'Declared' },
  { date: '2025-08-15', name: 'Independence Day',      type: 'National',  optional: 'Declared' },
  { date: '2025-08-16', name: 'Sri Krishna Jayanthi',  type: 'Festival',  optional: 'Declared' },
  { date: '2025-08-27', name: 'Ganesh Chaturthi',      type: 'Festival',  optional: 'Declared' },
  { date: '2025-10-02', name: 'Gandhi Jayanthi',       type: 'National',  optional: 'Declared' },
  { date: '2025-10-02', name: 'Dussehra',              type: 'Festival',  optional: 'Declared' },
  { date: '2025-10-20', name: 'Diwali',                type: 'Festival',  optional: 'Declared' },
  { date: '2025-11-05', name: 'Diwali (Naraka Chaturdasi)', type: 'Festival', optional: 'Declared' },
  { date: '2025-12-25', name: 'Christmas',             type: 'National',  optional: 'Declared' },
];

export const HOLIDAYS_2026: Holiday[] = [
  { date: '2026-01-01', name: 'New Year',              type: 'National',  optional: 'Declared' },
  { date: '2026-01-14', name: 'Bhogi',                 type: 'Festival',  optional: 'Declared' },
  { date: '2026-01-15', name: 'Makara Sankranthi',     type: 'Festival',  optional: 'Declared' },
  { date: '2026-01-26', name: 'Republic Day',          type: 'National',  optional: 'Declared' },
  { date: '2026-02-15', name: 'Maha Sivaratri',        type: 'Festival',  optional: 'Declared' },
  { date: '2026-03-20', name: 'Ugadi',                 type: 'Festival',  optional: 'Declared' },
  { date: '2026-03-20', name: 'Holi',                  type: 'Festival',  optional: 'Declared' },
  { date: '2026-04-03', name: 'Good Friday',           type: 'National',  optional: 'Declared' },
  { date: '2026-04-14', name: 'Dr. Ambedkar Jayanthi', type: 'National',  optional: 'Declared' },
  { date: '2026-05-01', name: 'May Day',               type: 'National',  optional: 'Declared' },
  { date: '2026-08-15', name: 'Independence Day',      type: 'National',  optional: 'Declared' },
  { date: '2026-09-05', name: 'Ganesh Chaturthi',      type: 'Festival',  optional: 'Declared' },
  { date: '2026-10-02', name: 'Gandhi Jayanthi',       type: 'National',  optional: 'Declared' },
  { date: '2026-10-19', name: 'Dussehra',              type: 'Festival',  optional: 'Declared' },
  { date: '2026-11-08', name: 'Diwali',                type: 'Festival',  optional: 'Declared' },
  { date: '2026-11-09', name: 'Diwali (Naraka Chaturdasi)', type: 'Festival', optional: 'Declared' },
  { date: '2026-12-25', name: 'Christmas',             type: 'National',  optional: 'Declared' },
];
