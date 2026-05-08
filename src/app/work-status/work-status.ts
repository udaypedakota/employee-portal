import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PROJECT_ALLOCATIONS } from './project-allocation.data';
import { EMPLOYEES } from '../employee/employee.data';

interface ProjectCard {
  name: string;
  domain: string;
  icon: string;
  color: string;
  tech: string[];
  active: boolean;
  modules?: { name: string; status: 'In Progress' | 'Completed' | 'Planned' }[];
  members: { id: string; name: string; role: string; initials: string; avatar?: string }[];
}

const PROJECT_META: Record<string, { domain: string; icon: string; color: string; tech: string[]; modules?: { name: string; status: 'In Progress' | 'Completed' | 'Planned' }[] }> = {
  'DCT':        { domain: 'Digital Cooperative Transformation', icon: '🏦', color: '#0055a5', tech: ['Java', 'Spring', 'Angular', 'MySQL', 'Kafka'],
    modules: [
      { name: 'Member Management', status: 'Completed' },
      { name: 'Share Management', status: 'Completed' },
      { name: 'Demand Deposits', status: 'In Progress' },
      { name: 'Loan Processing', status: 'In Progress' },
      { name: 'CBS Integration', status: 'In Progress' },
      { name: 'NCD Integration', status: 'In Progress' },
    ]
  },
  'ERP':        { domain: 'Enterprise Resource Planning', icon: '🏢', color: '#00897b', tech: ['Java', 'Spring Boot', 'Angular', 'MySQL', 'Jenkins'],
    modules: [
      { name: 'Membership', status: 'In Progress' },
      { name: 'Demand Deposits', status: 'In Progress' },
      { name: 'Loans & Advances', status: 'In Progress' },
      { name: 'Share Management', status: 'In Progress' },
      { name: 'Accounting & GL', status: 'In Progress' },
      { name: 'Mobile Application', status: 'In Progress' },
      { name: 'e-KYC Services', status: 'Planned' },
      { name: 'Reports & MIS', status: 'In Progress' },
      { name: 'CBS Integration', status: 'In Progress' },
      { name: 'MSSQL Migration', status: 'In Progress' },
    ]
  },
  'TIHCL':      { domain: 'Tamil Nadu Cooperative', icon: '🌿', color: '#2e7d32', tech: ['Java', 'Microservices', 'Angular', 'Kafka'],
    modules: [
      { name: 'Member Registration', status: 'Completed' },
      { name: 'FHR Reports', status: 'Completed' },
      { name: 'Microservices API', status: 'In Progress' },
      { name: 'Bug Tracking', status: 'In Progress' },
    ]
  },
  'FHR':        { domain: 'Financial Health Reports', icon: '📊', color: '#f57c00', tech: ['Java', 'Jasper Reports', 'MySQL', 'Angular'],
    modules: [
      { name: 'PACS Data Mapping', status: 'Completed' },
      { name: 'Report Generation', status: 'Completed' },
      { name: 'Adobe Illustrator Icons', status: 'Completed' },
    ]
  },
  'ARDB':       { domain: 'ARDB Banking System', icon: '🏛️', color: '#6a1b9a', tech: ['Java', 'Spring', 'MySQL', 'JUnit'],
    modules: [
      { name: 'DCT Migration', status: 'In Progress' },
      { name: 'JUnit Testing', status: 'In Progress' },
      { name: 'Manual Test Execution', status: 'Completed' },
    ]
  },
  'CoopsIndia': { domain: 'National Cooperative Portal', icon: '🌐', color: '#0277bd', tech: ['Java', 'PostgreSQL', 'Angular', 'OpenKM'],
    modules: [
      { name: 'OpenKM Document Flow', status: 'In Progress' },
      { name: 'PostgreSQL Migration', status: 'In Progress' },
    ]
  },
  'Insight':    { domain: 'Desktop Analytics App', icon: '💡', color: '#ef6c00', tech: ['Java', 'Electron', 'Ionic', 'MySQL'],
    modules: [
      { name: 'Electron Desktop Build', status: 'In Progress' },
    ]
  },
  'DevOps':     { domain: 'Infrastructure & DevOps', icon: '⚙️', color: '#37474f', tech: ['Docker', 'Jenkins', 'Linux', 'Ansible'],
    modules: [
      { name: 'Docker Pipeline', status: 'In Progress' },
      { name: 'Jenkins CI/CD', status: 'In Progress' },
      { name: 'Shell Automation', status: 'Completed' },
    ]
  },
  'Infra':      { domain: 'Infrastructure Support', icon: '🖥️', color: '#455a64', tech: ['Azure', 'Citrix', 'VMware', 'IIS'],
    modules: [
      { name: 'Azure Cloud Monitoring', status: 'In Progress' },
      { name: 'Citrix Cloud Setup', status: 'Completed' },
    ]
  },
};

@Component({
  selector: 'app-work-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-status.html',
  styleUrl: './work-status.css'
})
export class WorkStatusComponent {
  searchQuery = '';
  expandedProject: string | null = null;

  projects: ProjectCard[] = this.buildProjects();

  constructor(private router: Router) {}

  buildProjects(): ProjectCard[] {
    const map = new Map<string, ProjectCard>();

    for (const a of PROJECT_ALLOCATIONS) {
      const key = a.project.split(' - ')[0].split(' ')[0];
      const meta = PROJECT_META[key] || { domain: a.project, icon: '📁', color: '#6366f1', tech: [] };

      if (!map.has(key)) {
        map.set(key, { name: key, domain: meta.domain, icon: meta.icon, color: meta.color, tech: meta.tech, modules: meta.modules, active: this.isActive(a.endDate), members: [] });
      }

      const emp = EMPLOYEES.find(e => e.id === a.employeeId);
      map.get(key)!.members.push({
        id: a.employeeId,
        name: a.employeeName,
        role: a.role,
        initials: a.employeeName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase(),
        avatar: emp?.avatar
      });

      if (this.isActive(a.endDate)) map.get(key)!.active = true;
    }

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  get filteredProjects(): ProjectCard[] {
    const q = this.searchQuery.toLowerCase();
    if (!q) return this.projects;
    return this.projects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.domain.toLowerCase().includes(q) ||
      p.members.some(m => m.name.toLowerCase().includes(q))
    );
  }

  get totalMembers(): number {
    return new Set(PROJECT_ALLOCATIONS.map(a => a.employeeId)).size;
  }

  get activeCount(): number {
    return this.projects.filter(p => p.active).length;
  }

  isActive(end: string) {
    return new Date(end) >= new Date();
  }

  toggleProject(name: string) {
    this.expandedProject = this.expandedProject === name ? null : name;
  }

  viewEmployee(id: string) {
    this.router.navigate(['/employee', id]);
  }
}
