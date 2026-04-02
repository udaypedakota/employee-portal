import { Injectable } from '@angular/core';
import { BirthdayEvent, Contribution, Expense, EventSummary } from './birthday-fund.models';

@Injectable({ providedIn: 'root' })
export class BirthdayFundService {

  private load<T>(key: string): T[] {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  }

  private save<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  // ── Seed birthday events (runs once) ────────────────────
  seedEvents(): void {
    if (localStorage.getItem('bf_seeded') === 'v4') return;
    const year = new Date().getFullYear();
    const toDate = (dob: string) => {
      const months: Record<string, string> = {
        jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',
        jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'
      };
      const p = dob.trim().split(/[-\/]/);
      if (p.length === 3) {
        const d = p[0].padStart(2,'0');
        const m = isNaN(+p[1]) ? months[p[1].toLowerCase().slice(0,3)] : p[1].padStart(2,'0');
        return { birthDate: `${p[2]}-${m}-${d}`, celebrationDate: `${year}-${m}-${d}` };
      }
      return { birthDate: dob, celebrationDate: dob };
    };
    const data: { employeeId: string; employeeName: string; dob: string }[] = [
      { employeeId: 'CBHYD626', employeeName: 'Bora Kiran Kumar',             dob: '12-Jun-1996'   },
      { employeeId: 'CBHYD627', employeeName: 'Aravind Gundu',                dob: '11-Jan-1996'   },
      { employeeId: 'CBHYD621', employeeName: 'Thakkallapalli Phanidher',     dob: '12-Oct-1993'   },
      { employeeId: 'CBHYD629', employeeName: 'Tankala Tirupati Raju',        dob: '05-Sep-1996'   },
      { employeeId: 'CBHYD642', employeeName: 'Siddi Amulya',                 dob: '01-May-2000'   },
      { employeeId: 'CBHYD631', employeeName: 'Mamidi Nani',                  dob: '17-Dec-1998'   },
      { employeeId: 'CBHYD367', employeeName: 'Pachiripalli Subhash Bhargav', dob: '25-Jul-1999'   },
      { employeeId: 'CBHYD638', employeeName: 'Talluri Prudhvi',              dob: '29-Jul-1998'   },
      { employeeId: 'CBHYD639', employeeName: 'Kodavali Bhargavi',            dob: '04-Jun-1996'   },
      { employeeId: 'CBHYD636', employeeName: 'Chatti Raviteja',              dob: '01-Jul-1990'   },
      { employeeId: 'CBHYD655', employeeName: 'Malla Akhila',                 dob: '12-Aug-2002'   },
      { employeeId: 'CBHYD656', employeeName: 'Kallepilli Yamuna',            dob: '20-06-2002'    },
      { employeeId: 'CBHYD640', employeeName: 'Karthik Jakkula',              dob: '08-Jul-1994'   },
      { employeeId: 'CBHYD620', employeeName: 'Degala Sriramamurty',          dob: '09-Feb-1990'   },
      { employeeId: 'CBHYD604', employeeName: 'Vaddi Navya Sree',             dob: '25-May-1994'   },
      { employeeId: 'CBHYD649', employeeName: 'Korla Ramu',                   dob: '02-Apr-2001'   },
      { employeeId: 'CBHYD652', employeeName: 'Avidi Rajesh',                 dob: '03-Oct-1999'   },
      { employeeId: 'CBHYD643', employeeName: 'Dilip Kumar Gurijala',         dob: '24-03-2001'    },
      { employeeId: 'CBHYD644', employeeName: 'Kotturu Saikumar',             dob: '15-04-1999'    },
      { employeeId: 'CBHYD645', employeeName: 'Gedela Dileep Kumar',          dob: '17-06-1998'    },
      { employeeId: 'CBHYD646', employeeName: 'Laxmi Prasanna Kumar S',       dob: '10-Sep-1998'   },
      { employeeId: 'CBHYD648', employeeName: 'Sahukari Praveen Chowdary',    dob: '20-06-1998'    },
      { employeeId: 'CBHYD647', employeeName: 'Bagadi Jogarao',               dob: '18-Jan-1998'   },
      { employeeId: 'CBHYD650', employeeName: 'Bhavana Maddamsetty',          dob: '19-Feb-2001'   },
      { employeeId: 'CBHYD605', employeeName: 'Yarlanki Siva Kumar',          dob: '16-May-1991'   },
    ];
    const knownIds = data.map(d => d.employeeId);
    const existing = this.getEvents().filter(e => !knownIds.includes(e.employeeId));
    const newEvents = data.map(d => {
      const { birthDate, celebrationDate } = toDate(d.dob);
      return { id: this.uid(), employeeId: d.employeeId, employeeName: d.employeeName, birthDate, celebrationDate };
    });
    this.save('bf_events', [...existing, ...newEvents]);
    localStorage.setItem('bf_seeded', 'v4');
  }

  // ── Events ──────────────────────────────────────────
  getEvents(): BirthdayEvent[] {
    return this.load<BirthdayEvent>('bf_events');
  }

  addEvent(e: Omit<BirthdayEvent, 'id'>): BirthdayEvent {
    const events = this.getEvents();
    const newEvent = { ...e, id: this.uid() };
    this.save('bf_events', [...events, newEvent]);
    return newEvent;
  }

  deleteEvent(id: string): void {
    this.save('bf_events', this.getEvents().filter(e => e.id !== id));
    this.save('bf_contributions', this.getContributions().filter(c => c.eventId !== id));
    this.save('bf_expenses', this.getExpenses().filter(x => x.eventId !== id));
  }

  // ── Contributions ────────────────────────────────────
  getContributions(): Contribution[] {
    return this.load<Contribution>('bf_contributions');
  }

  getContributionsByEvent(eventId: string): Contribution[] {
    return this.getContributions().filter(c => c.eventId === eventId);
  }

  addContribution(c: Omit<Contribution, 'id'>): void {
    const all = this.getContributions();
    this.save('bf_contributions', [...all, { ...c, id: this.uid() }]);
  }

  updateEvent(id: string, patch: Partial<BirthdayEvent>): void {
    const all = this.getEvents().map(e => e.id === id ? { ...e, ...patch } : e);
    this.save('bf_events', all);
  }

  updateContributionStatus(id: string, status: 'paid' | 'pending', amount?: number): void {
    const all = this.getContributions().map(c =>
      c.id === id ? {
        ...c,
        status,
        amount: amount ?? c.amount,
        paidOn: status === 'paid' ? new Date().toISOString().slice(0, 10) : c.paidOn
      } : c
    );
    this.save('bf_contributions', all);
  }

  deleteContribution(id: string): void {
    this.save('bf_contributions', this.getContributions().filter(c => c.id !== id));
  }

  // ── Expenses ─────────────────────────────────────────
  getExpenses(): Expense[] {
    return this.load<Expense>('bf_expenses');
  }

  getExpensesByEvent(eventId: string): Expense[] {
    return this.getExpenses().filter(x => x.eventId === eventId);
  }

  addExpense(x: Omit<Expense, 'id'>): void {
    const all = this.getExpenses();
    this.save('bf_expenses', [...all, { ...x, id: this.uid() }]);
  }

  deleteExpense(id: string): void {
    this.save('bf_expenses', this.getExpenses().filter(x => x.id !== id));
  }

  // ── Summary ──────────────────────────────────────────
  getSummary(eventId: string, carryForward = 0): EventSummary {
    const event = this.getEvents().find(e => e.id === eventId)!;
    const contributions = this.getContributionsByEvent(eventId);
    const expenses = this.getExpensesByEvent(eventId);
    const totalCollected = contributions.filter(c => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
    const totalExpense = expenses.reduce((s, x) => s + x.amount, 0);
    const netTotal = carryForward + totalCollected;
    const netBalance = netTotal - totalExpense;
    return {
      event,
      totalCollected,
      totalExpense,
      balance: totalCollected - totalExpense,
      carryForward,
      netTotal,
      netBalance,
      contributions,
      expenses,
      pendingContributors: contributions.filter(c => c.status === 'pending'),
    };
  }

  getAllSummaries(): EventSummary[] {
    const events = this.getEvents().sort((a, b) => a.celebrationDate.localeCompare(b.celebrationDate));
    let runningBalance = 0;
    return events.map(e => {
      const summary = this.getSummary(e.id, runningBalance);
      runningBalance = summary.netBalance;
      return summary;
    });
  }

  // ── Export CSV ───────────────────────────────────────
  exportCSV(eventId: string): void {
    const allSummaries = this.getAllSummaries();
    const s = allSummaries.find(x => x.event.id === eventId)!;
    const rows = [
      ['Party Tracker Report - ' + s.event.employeeName],
      ['Celebration Date', s.event.celebrationDate],
      [''],
      ['Carry Forward (Previous Balance)', s.carryForward],
      ['CONTRIBUTIONS'],
      ['Name', 'Amount', 'Status', 'Paid On'],
      ...s.contributions.map(c => [c.contributorName, c.amount, c.status, c.paidOn]),
      [''],
      ['EXPENSES'],
      ['Category', 'Description', 'Amount', 'Date'],
      ...s.expenses.map(x => [x.category, x.description, x.amount, x.date]),
      [''],
      ['Total Collected', s.totalCollected],
      ['Carry Forward', s.carryForward],
      ['Net Total', s.netTotal],
      ['Total Expense', s.totalExpense],
      ['Net Balance', s.netBalance],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `birthday-fund-${s.event.employeeName.replace(/\s+/g, '-')}.csv`;
    a.click();
  }
}
