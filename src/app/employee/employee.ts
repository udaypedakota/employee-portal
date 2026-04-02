import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Employee } from './employee.data';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css'
})
export class EmployeeDetail implements OnInit {
  employee: Employee | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private employeeService: EmployeeService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.employee = this.employeeService.getAll().find(e => e.id === id);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
