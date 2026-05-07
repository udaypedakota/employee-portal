import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-center.html',
  styleUrl: './help-center.css',
})
export class HelpCenterComponent {
  openIndex: number | null = null;

  toggle(i: number) {
    this.openIndex = this.openIndex === i ? null : i;
  }

  faqs = [
    {
      q: 'How do I view my profile?',
      a: 'Click on "My Profile" in the sidebar navigation. You can see your personal details, skills, projects, and current work status.'
    },
    {
      q: 'How do I check upcoming holidays?',
      a: 'Navigate to "Holiday Calendar" in the sidebar. It shows all public and company holidays for the current year.'
    },
    {
      q: 'How do I see project allocations?',
      a: 'Admins can access "Project Allocations" from the sidebar to view all employee task assignments and progress.'
    },
    {
      q: 'How do I check a teammate\'s birthday?',
      a: 'Go to the Birthday Tracker section. It shows upcoming birthdays and lets you track celebration funds.'
    },
    {
      q: 'Who do I contact for portal issues?',
      a: 'Reach out to your system administrator or email support@intellectinfo.com for any technical issues.'
    },
    {
      q: 'How do I update my information?',
      a: 'Employee details are managed by the admin. Contact your admin or HR to update your profile information.'
    },
  ];

  contacts = [
    { icon: '📧', label: 'Email Support', value: 'support@intellectinfo.com' },
    { icon: '📞', label: 'IT Helpdesk', value: '+91 40 1234 5678' },
    { icon: '💬', label: 'Internal Chat', value: 'Teams / Slack — #it-support' },
  ];
}
