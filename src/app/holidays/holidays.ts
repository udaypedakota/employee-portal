import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Holiday, HOLIDAYS_2025, HOLIDAYS_2026 } from './holidays.data';

@Component({
  selector: 'app-holidays',
  imports: [CommonModule, FormsModule],
  templateUrl: './holidays.html',
  styleUrl: './holidays.css',
})
export class HolidaysComponent implements OnInit {
  selectedYear = new Date().getFullYear();
  selectedMonth = 'All months';
  selectedType = 'All types';

  years = [2025, 2026];
  months = ['All months','January','February','March','April','May','June','July','August','September','October','November','December'];
  types = ['All types', 'National', 'Festival', 'Regional'];

  allHolidays: Holiday[] = [];

  ngOnInit() { this.loadYear(); }

  loadYear() {
    this.allHolidays = this.selectedYear === 2025 ? HOLIDAYS_2025 : HOLIDAYS_2026;
  }

  onYearChange() { this.loadYear(); }

  reset() {
    this.selectedMonth = 'All months';
    this.selectedType = 'All types';
  }

  get filtered(): Holiday[] {
    return this.allHolidays.filter(h => {
      const d = new Date(h.date);
      const monthMatch = this.selectedMonth === 'All months' ||
        d.toLocaleString('default', { month: 'long' }) === this.selectedMonth;
      const typeMatch = this.selectedType === 'All types' || h.type === this.selectedType;
      return monthMatch && typeMatch;
    });
  }

  getDay(date: string) {
    return new Date(date).toLocaleDateString('en-IN', { weekday: 'long' });
  }

  getDayNum(date: string) {
    return new Date(date).getDate().toString().padStart(2, '0');
  }

  getMonth(date: string) {
    return new Date(date).toLocaleString('default', { month: 'short' }).toUpperCase();
  }

  getFullDate(date: string) {
    return new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
  }

  getInitials(name: string) {
    return name.split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('').toUpperCase() || name.slice(0, 2).toUpperCase();
  }

  isWeeklyOff(date: string) {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  }

  getWeeklyOffLabel(date: string) {
    return this.isWeeklyOff(date) ? 'Falls on Weekly Off' : 'Working Day';
  }
}
