import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmptyError } from 'rxjs';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { ModalDismissReasons, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  public employees: Employee[];
  public newEmployee: Employee;
  public delEmployee: Employee;
  closeResult: string;

  constructor(private employeeService: EmployeeService, private modalService: NgbModal){}
  
  ngOnInit(){
    this.getEmployees();
  }

  public test(name: string): void {
    alert(name);
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
      alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm: NgForm): void {
    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onUpdateEmployee(employee: Employee, content: any): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
     );
  }

  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
     );
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) != -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) != -1
      || employee.phoneNum.toLowerCase().indexOf(key.toLowerCase()) != -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) != -1)
      {
        results.push(employee);
      }
      this.employees = results;
      if ( results.length == 0 || !key){
        this.getEmployees();
      }
    }
  }


  openAddEmployee(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'addEmployeeModal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.closeModal(content)}`;
    });
  }

  openEditEmployee(content: any, employee: Employee) {
    this.newEmployee = employee;
    this.modalService.open(content, {ariaLabelledBy: 'updateEmployeeModal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.closeModal(content)}`;
    });
  }
  
  private closeModal(reason: any) : string{
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
