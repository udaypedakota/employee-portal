import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BirthdayFundService } from './birthday-fund.service';
import { BirthdayEvent, Contribution, Expense, EventSummary } from './birthday-fund.models';
import { EmployeeService } from '../employee/employee.service';

type Tab = 'events' | 'collections' | 'expenses' | 'reports';

@Component({
  selector: 'app-birthday-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './birthday-tracker.html',
  styleUrl: './birthday-tracker.css',
})
export class BirthdayTrackerComponent implements OnInit {
  constructor(public svc: BirthdayFundService, public router: Router, private empSvc: EmployeeService) {}

  activeTab: Tab = 'events';
  get employees() { return this.empSvc.getAll(); }

  // ── Events ──────────────────────────────────────────
  events: BirthdayEvent[] = [];
  showEventModal = false;
  showEditModal = false;
  editEvent: Partial<BirthdayEvent> & { id?: string } = {};
  newEvent: Partial<BirthdayEvent> = {};

  // ── Selected Event (for collections/expenses tabs) ──
  selectedEventId = '';
  get selectedSummary(): EventSummary | null {
    if (!this.selectedEventId) return null;
    return this.summaries.find(s => s.event.id === this.selectedEventId) ?? null;
  }

  // ── Contributions ────────────────────────────────────
  showContribModal = false;
  newContrib: Partial<Contribution> = {};
  fixedAmount = 30;

  get allEmployeeRows() {
    if (!this.selectedEventId) return [];
    const event = this.events.find(e => e.id === this.selectedEventId);
    const contribs = this.svc.getContributionsByEvent(this.selectedEventId);
    return this.employees
      .filter(e => e.role !== 'Project Manager' && e.id !== event?.employeeId)
      .map(e => {
        const found = contribs.find(c => c.contributorId === e.id);
        return { employee: e, contribution: found ?? null };
      });
  }

  get paidCount() { return this.allEmployeeRows.filter(r => r.contribution?.status === 'paid').length; }
  get pendingCount() { return this.allEmployeeRows.filter(r => !r.contribution || r.contribution.status === 'pending').length; }
  get totalCollectedDisplay() {
    return this.allEmployeeRows
      .filter(r => r.contribution?.status === 'paid')
      .reduce((s, r) => s + (r.contribution?.amount ?? 0), 0);
  }

  get carryForwardDisplay() {
    return this.selectedSummary?.carryForward ?? 0;
  }

  get netTotalDisplay() {
    return this.carryForwardDisplay + this.totalCollectedDisplay;
  }

  get netBalanceDisplay() {
    return this.netTotalDisplay - (this.selectedSummary?.totalExpense ?? 0);
  }

  // ── Expenses ─────────────────────────────────────────
  showExpenseModal = false;
  newExpense: Partial<Expense> = {};
  expenseCategories = ['cake', 'gift', 'snacks', 'decoration', 'other'];

  // ── Reports ──────────────────────────────────────────
  summaries: EventSummary[] = [];
  reportMonth = '';


  get filteredSummaries(): EventSummary[] {
    const today = new Date().toISOString().slice(0, 10);
    const past = this.summaries.filter(s => s.event.celebrationDate <= today);
    if (!this.reportMonth) return past;
    return past.filter(s => s.event.celebrationDate.startsWith(this.reportMonth));
  }

  get reportTotals() {
    const list = this.filteredSummaries;
    return {
      collected: list.reduce((s, x) => s + x.totalCollected, 0),
      expense: list.reduce((s, x) => s + x.totalExpense, 0),
      balance: list.reduce((s, x) => s + x.balance, 0),
    };
  }

  // ── Delete confirm ───────────────────────────────────
  showDeleteModal = false;
  deleteType: 'event' | 'contribution' | 'expense' = 'event';
  deleteTargetId = '';
  deleteTargetLabel = '';

  ngOnInit() {
    this.svc.seedEvents();
    this.empSvc.load().subscribe(() => this.refresh());
  }

  refresh() {
    this.events = this.svc.getEvents();
    this.summaries = this.svc.getAllSummaries();
  }

  setTab(tab: Tab) {
    this.activeTab = tab;
    if (tab === 'reports') this.refresh();
    if (tab === 'expenses' && !this.selectedEventId && this.completedEvents.length > 0) {
      this.selectedEventId = this.completedEvents[0].id;
    }
  }

  selectEvent(id: string) {
    this.selectedEventId = id;
    this.activeTab = 'collections';
  }

  // ── Event CRUD ───────────────────────────────────────
  openEventModal() { this.newEvent = {}; this.showEventModal = true; }

  saveEvent() {
    const e = this.newEvent;
    if (!e.employeeId || !e.celebrationDate) return;
    const emp = this.employees.find(x => x.id === e.employeeId);
    this.svc.addEvent({
      employeeId: e.employeeId!,
      employeeName: emp?.name || e.employeeId!,
      birthDate: e.birthDate || '',
      celebrationDate: e.celebrationDate!,
      notes: e.notes,
    });
    this.showEventModal = false;
    this.refresh();
  }

  openEditModal(e: BirthdayEvent) {
    this.editEvent = { ...e };
    this.showEditModal = true;
  }

  saveEditEvent() {
    const e = this.editEvent;
    if (!e.id || !e.celebrationDate) return;
    this.svc.updateEvent(e.id, {
      birthDate: e.birthDate,
      celebrationDate: e.celebrationDate,
      notes: e.notes,
    });
    this.showEditModal = false;
    this.refresh();
  }

  // ── Contribution CRUD ────────────────────────────────
  openContribModal() {
    this.newContrib = { eventId: this.selectedEventId, status: 'paid', paidOn: today() };
    this.showContribModal = true;
  }

  saveContrib() {
    const c = this.newContrib;
    if (!c.contributorName || !c.amount || !c.eventId) return;
    this.svc.addContribution({
      eventId: c.eventId!,
      contributorId: c.contributorId || '',
      contributorName: c.contributorName!,
      amount: +c.amount,
      paidOn: c.paidOn || today(),
      status: c.status as 'paid' | 'pending',
    });
    this.showContribModal = false;
    this.refresh();
  }

  toggleStatus(id: string, current: 'paid' | 'pending') {
    this.svc.updateContributionStatus(id, current === 'paid' ? 'pending' : 'paid');
    this.refresh();
  }

  markEmployeePaid(employeeId: string, employeeName: string, status: 'paid' | 'pending') {
    const contribs = this.svc.getContributionsByEvent(this.selectedEventId);
    const existing = contribs.find(c => c.contributorId === employeeId);
    if (existing) {
      this.svc.updateContributionStatus(existing.id, status, this.fixedAmount);
    } else if (status === 'paid') {
      this.svc.addContribution({
        eventId: this.selectedEventId,
        contributorId: employeeId,
        contributorName: employeeName,
        amount: this.fixedAmount,
        paidOn: today(),
        status: 'paid',
      });
    }
    this.refresh();
  }

  // ── Expense CRUD ─────────────────────────────────────
  openExpenseModal() {
    this.newExpense = { eventId: this.selectedEventId, date: today(), category: 'cake' };
    this.showExpenseModal = true;
  }

  saveExpense() {
    const x = this.newExpense;
    if (!x.description || !x.amount || !x.eventId) return;
    this.svc.addExpense({
      eventId: x.eventId!,
      category: x.category as Expense['category'],
      description: x.description!,
      amount: +x.amount,
      date: x.date || today(),
    });
    this.showExpenseModal = false;
    this.refresh();
  }

  // ── Delete ───────────────────────────────────────────
  askDelete(type: 'event' | 'contribution' | 'expense', id: string, label: string) {
    this.deleteType = type;
    this.deleteTargetId = id;
    this.deleteTargetLabel = label;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.deleteType === 'event') this.svc.deleteEvent(this.deleteTargetId);
    if (this.deleteType === 'contribution') this.svc.deleteContribution(this.deleteTargetId);
    if (this.deleteType === 'expense') this.svc.deleteExpense(this.deleteTargetId);
    this.showDeleteModal = false;
    if (this.deleteType === 'event' && this.selectedEventId === this.deleteTargetId) this.selectedEventId = '';
    this.refresh();
  }

  exportCSV(eventId: string) { this.svc.exportCSV(eventId); }

  get sortedEvents(): BirthdayEvent[] {
    const today = new Date();
    const mmdd = (d: string) => d.slice(5); // 'YYYY-MM-DD' → 'MM-DD'
    const todayMMDD = `${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const currentMMDD = `${String(today.getMonth()+1).padStart(2,'0')}-01`; // start of current month

    return [...this.events]
      .filter(e => {
        const md = mmdd(e.birthDate || e.celebrationDate);
        // show only current month and past months (not future months)
        return md <= todayMMDD || md.slice(0,2) <= todayMMDD.slice(0,2);
      })
      .sort((a, b) => {
        const amd = mmdd(a.birthDate || a.celebrationDate);
        const bmd = mmdd(b.birthDate || b.celebrationDate);
        const aToday = amd === todayMMDD;
        const bToday = bmd === todayMMDD;
        if (aToday && !bToday) return -1;
        if (!aToday && bToday) return 1;
        // sort rest descending (most recent first)
        return bmd.localeCompare(amd);
      });
  }

  isToday(dateStr: string): boolean {
    const today = new Date();
    const mmdd = `${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    return (dateStr || '').slice(5) === mmdd;
  }

  // ── QR Modal ──
  showQRModal = false;
  activeQRImage = '';
  activeQRName = '';

  openQR(image: string, name: string) {
    this.activeQRImage = image;
    this.activeQRName = name;
    this.showQRModal = true;
  }

  get completedEvents() {
    const today = new Date().toISOString().slice(0, 10);
    return this.events
      .filter(e => e.celebrationDate <= today)
      .sort((a, b) => b.celebrationDate.localeCompare(a.celebrationDate));
  }

  get upcomingEvents() {
    const today = new Date().toISOString().slice(0, 10);
    return this.events
      .filter(e => e.celebrationDate > today)
      .sort((a, b) => a.celebrationDate.localeCompare(b.celebrationDate));
  }

  isPast(dateStr: string): boolean {
    return new Date(dateStr) < new Date(new Date().toDateString());
  }

  categoryIcon(cat: string): string {
    return { cake: '🎂', gift: '🎁', snacks: '🍿', decoration: '🎊', other: '💰' }[cat] || '💰';
  }

  // ── Chart helpers ────────────────────────────────────
  get chartData() {
    const list = this.filteredSummaries;
    const maxVal = Math.max(...list.map(s => Math.max(s.totalCollected, s.totalExpense)), 1);
    const barH = 180;
    return list.map(s => ({
      name: s.event.employeeName.split(' ').slice(-1)[0], // last name only
      fullName: s.event.employeeName,
      date: s.event.celebrationDate,
      collected: s.totalCollected,
      expense: s.totalExpense,
      balance: s.netBalance,
      collectedH: Math.round((s.totalCollected / maxVal) * barH),
      expenseH: Math.round((s.totalExpense / maxVal) * barH),
      categories: this.expenseCategories
        .map(c => ({ cat: c, amt: s.expenses.filter(x => x.category === c).reduce((a, b) => a + b.amount, 0) }))
        .filter(x => x.amt > 0),
      totalExpense: s.totalExpense,
    }));
  }

  catColor(cat: string): string {
    return { cake: '#f59e0b', gift: '#3b82f6', snacks: '#22c55e', decoration: '#a855f7', other: '#64748b' }[cat] || '#64748b';
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
