import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPLOYEES, Employee } from './employee.data';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

const API = 'http://localhost:3000/api/employees';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees: Employee[] = [...EMPLOYEES];

  constructor(private http: HttpClient) {}

  load(): Observable<Employee[]> {
    return this.http.get<Employee[]>(API).pipe(
      tap(data => this.employees = data),
      catchError(() => of(this.employees))
    );
  }

  getAll(): Employee[] {
    return this.employees;
  }

  add(employee: Employee): Observable<any> {
    return this.http.post(API, employee).pipe(
      tap(() => this.employees.push(employee)),
      catchError(() => { this.employees.push(employee); return of(null); })
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${API}/${id}`).pipe(
      tap(() => this.employees = this.employees.filter(e => e.id !== id)),
      catchError(() => { this.employees = this.employees.filter(e => e.id !== id); return of(null); })
    );
  }
}
