import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { BirthdayEvent, Contribution, Expense, EventSummary } from './birthday-fund.models';

@Injectable({ providedIn: 'root' })
export class BirthdayFundService {

  constructor(private http: HttpClient) {}

  // ── In-memory cache for events (source of truth = JSON) ──
  private eventsCache: BirthdayEvent[] = [];

  private uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  private loadStorage<T>(key: string): T[] {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  }

  private saveStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ── Always fetch fresh from JSON, never cache ──
  seedEvents(): Observable<BirthdayEvent[]> {
    const year = new Date().getFullYear();
    return this.http.get<{ employeeId: string; employeeName: string; birthDate: string }[]>('birthdays.json?t=' + Date.now()).pipe(
      map(data => {
        // preserve IDs so contributions still link correctly
        const existing = this.loadStorage<BirthdayEvent>('bf_events');
        const jsonIds = data.map(d => d.employeeId);
        const manual = existing.filter(e => !jsonIds.includes(e.employeeId));
        const fromJson: BirthdayEvent[] = data.map(d => {
          const mm = d.birthDate.slice(5, 7);
          const dd = d.birthDate.slice(8, 10);
          const found = existing.find(e => e.employeeId === d.employeeId);
          return {
            id: found?.id ?? this.uid(),
            employeeId: d.employeeId,
            employeeName: d.employeeName,
            birthDate: d.birthDate,
            celebrationDate: `${year}-${mm}-${dd}`,
            notes: found?.notes,
          };
        });
        return [...fromJson, ...manual];
      }),
      tap(events => {
        this.eventsCache = events;
        this.saveStorage('bf_events', events);
      })
    );
  }

  // ── Events (from memory cache after seedEvents) ──
  getEvents(): BirthdayEvent[] {
    return this.eventsCache;
  }

  addEvent(e: Omit<BirthdayEvent, 'id'>): BirthdayEvent {
    const newEvent = { ...e, id: this.uid() };
    this.eventsCache = [...this.eventsCache, newEvent];
    this.saveStorage('bf_events', this.eventsCache);
    return newEvent;
  }

  deleteEvent(id: string): void {
    this.eventsCache = this.eventsCache.filter(e => e.id !== id);
    this.saveStorage('bf_events', this.eventsCache);
    this.saveStorage('bf_contributions', this.getContributions().filter(c => c.eventId !== id));
    this.saveStorage('bf_expenses', this.getExpenses().filter(x => x.eventId !== id));
  }

  updateEvent(id: string, patch: Partial<BirthdayEvent>): void {
    this.eventsCache = this.eventsCache.map(e => e.id === id ? { ...e, ...patch } : e);
    this.saveStorage('bf_events', this.eventsCache);
  }

  // ── Contributions (user-entered, stays in localStorage) ──
  getContributions(): Contribution[] {
    return this.loadStorage<Contribution>('bf_contributions');
  }

  getContributionsByEvent(eventId: string): Contribution[] {
    return this.getContributions().filter(c => c.eventId === eventId);
  }

  addContribution(c: Omit<Contribution, 'id'>): void {
    const all = this.getContributions();
    this.saveStorage('bf_contributions', [...all, { ...c, id: this.uid() }]);
  }

  updateContributionStatus(id: string, status: 'paid' | 'pending', amount?: number): void {
    const all = this.getContributions().map(c =>
      c.id === id ? {
        ...c, status,
        amount: amount ?? c.amount,
        paidOn: status === 'paid' ? new Date().toISOString().slice(0, 10) : c.paidOn
      } : c
    );
    this.saveStorage('bf_contributions', all);
  }

  deleteContribution(id: string): void {
    this.saveStorage('bf_contributions', this.getContributions().filter(c => c.id !== id));
  }

  // ── Expenses (user-entered, stays in localStorage) ──
  getExpenses(): Expense[] {
    return this.loadStorage<Expense>('bf_expenses');
  }

  getExpensesByEvent(eventId: string): Expense[] {
    return this.getExpenses().filter(x => x.eventId === eventId);
  }

  addExpense(x: Omit<Expense, 'id'>): void {
    const all = this.getExpenses();
    this.saveStorage('bf_expenses', [...all, { ...x, id: this.uid() }]);
  }

  deleteExpense(id: string): void {
    this.saveStorage('bf_expenses', this.getExpenses().filter(x => x.id !== id));
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
      event, totalCollected, totalExpense,
      balance: totalCollected - totalExpense,
      carryForward, netTotal, netBalance,
      contributions, expenses,
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
    const s = this.getAllSummaries().find(x => x.event.id === eventId)!;
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
