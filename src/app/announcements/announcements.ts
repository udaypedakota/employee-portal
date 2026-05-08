import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Announcement {
  id: number;
  title: string;
  body: string;
  category: 'General' | 'HR' | 'Technical' | 'Event';
  date: string;
  pinned: boolean;
  author: string;
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './announcements.html',
  styleUrl: './announcements.css',
})
export class AnnouncementsComponent implements OnInit {
  isAdmin = false;
  filter: string = 'All';
  showForm = false;
  expandedId: number | null = null;

  newAnn: Partial<Announcement> = {};

  announcements: Announcement[] = [
    { id: 1, title: 'Office Timings Update', body: 'Effective from June 1st, office hours will be 9:30 AM to 6:30 PM IST. Please plan your commute accordingly. Flexible work-from-home options remain available on Fridays with prior manager approval.', category: 'HR', date: '2025-05-01', pinned: true, author: 'HR Team' },
    { id: 2, title: 'ERP Go-Live Preparation', body: 'The ERP system is scheduled for go-live in Q3 2025. All team members are requested to complete their assigned module testing by June 30th. Please raise any blockers in the daily standup.', category: 'Technical', date: '2025-05-03', pinned: true, author: 'Balakrishna' },
    { id: 3, title: 'Team Outing — July 2025', body: 'We are planning a team outing in July 2025. Please fill in the availability form shared on the group. Venue and date will be finalized based on majority availability.', category: 'Event', date: '2025-05-05', pinned: false, author: 'HR Team' },
    { id: 4, title: 'New Joiners Welcome', body: 'Please welcome Sai Teja and Visruth who have joined the UI Development team. They will be working on the ERP Angular module. Please help them get onboarded smoothly.', category: 'General', date: '2025-05-06', pinned: false, author: 'HR Team' },
    { id: 5, title: 'Code Review Guidelines Updated', body: 'The code review checklist has been updated. All PRs must now include unit test coverage and Swagger documentation for new APIs. Please refer to the updated guidelines on the internal wiki.', category: 'Technical', date: '2025-04-28', pinned: false, author: 'Balakrishna' },
    { id: 6, title: 'Salary Revision — FY 2025-26', body: 'Annual salary revisions for FY 2025-26 have been processed. Revised offer letters will be shared by HR individually over email by May 15th. Please reach out to HR for any queries.', category: 'HR', date: '2025-04-25', pinned: false, author: 'HR Team' },
  ];

  categories = ['All', 'General', 'HR', 'Technical', 'Event'];

  ngOnInit() {
    const id = localStorage.getItem('loggedInEmployeeId');
    this.isAdmin = id === 'ADMIN' || !id;
    const stored = localStorage.getItem('announcements');
    if (stored) this.announcements = JSON.parse(stored);
  }

  get filtered(): Announcement[] {
    const list = this.filter === 'All' ? this.announcements : this.announcements.filter(a => a.category === this.filter);
    return [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  categoryColor(cat: string): string {
    return { General: '#6366f1', HR: '#10b981', Technical: '#f59e0b', Event: '#ec4899' }[cat] || '#6366f1';
  }

  categoryBg(cat: string): string {
    return { General: '#eef2ff', HR: '#d1fae5', Technical: '#fef3c7', Event: '#fce7f3' }[cat] || '#eef2ff';
  }

  formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  toggleExpand(id: number) { this.expandedId = this.expandedId === id ? null : id; }

  openForm() { this.newAnn = { category: 'General', date: new Date().toISOString().slice(0, 10), pinned: false }; this.showForm = true; }

  saveAnn() {
    if (!this.newAnn.title || !this.newAnn.body) return;
    const ann: Announcement = {
      id: Date.now(), title: this.newAnn.title!, body: this.newAnn.body!,
      category: this.newAnn.category as Announcement['category'] || 'General',
      date: this.newAnn.date || new Date().toISOString().slice(0, 10),
      pinned: this.newAnn.pinned || false, author: 'Admin'
    };
    this.announcements = [ann, ...this.announcements];
    localStorage.setItem('announcements', JSON.stringify(this.announcements));
    this.showForm = false;
  }

  deleteAnn(id: number) {
    this.announcements = this.announcements.filter(a => a.id !== id);
    localStorage.setItem('announcements', JSON.stringify(this.announcements));
  }

  togglePin(ann: Announcement) {
    ann.pinned = !ann.pinned;
    localStorage.setItem('announcements', JSON.stringify(this.announcements));
  }
}
