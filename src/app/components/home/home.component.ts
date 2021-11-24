import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbCalendar, NgbDate} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchForm!: FormGroup;
  errorMessage: string = "";

  hoveredDate: NgbDate | null = null;
  startDate: NgbDate | null = null;
  endDate: NgbDate | null = null;

  availableResidentsNumber: Array<number> = [];
  residentsNumber: number = 2;

  constructor(private calendar: NgbCalendar,
              private router: Router) {
    this.startDate = calendar.getToday();
    this.endDate = calendar.getNext(calendar.getToday(), 'd', 7);
  }

  ngOnInit(): void {
    this.availableResidentsNumber = Array.from(new Array(15), (x, i) => i + 1);

    this.searchForm = new FormGroup({
      location: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(80)
      ])
    })

  }

  searchRooms() {
    this.errorMessage = "";

    if (!this.searchForm.valid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    if (this.residentsNumber < 1) {
      this.errorMessage = "Niepoprawna ilość gości";
      return;
    }

    if (this.startDate == null || this.endDate == null) {
      this.errorMessage = "Niepoprawny czas rezerwacji";
      return;
    }

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let startDate = new Date(this.startDate.year, this.startDate.month - 1, this.startDate.day);
    if (yesterday >= startDate) {
      this.errorMessage = "Niepoprawny czas rezerwacji";
      return;
    }

    let formattedStartDate = formatDate(this.startDate.year + "-" + this.startDate.month + "-" + this.startDate.day, "dd-MM-yyyy", 'en-US');
    let formattedEndDate = formatDate(this.endDate.year + "-" + this.endDate.month + "-" + this.endDate.day, "dd-MM-yyyy", 'en-US');

    this.router.navigate(['/rooms',
      this.location?.value,
      this.residentsNumber,
      formattedStartDate,
      formattedEndDate]);
  }

  onDateSelection(date: NgbDate) {
    if (!this.startDate && !this.endDate) {
      this.startDate = date;
    } else if (this.startDate && !this.endDate && date.after(this.startDate)) {
      this.endDate = date;
    } else {
      this.endDate = null;
      this.startDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.startDate && !this.endDate && this.hoveredDate && date.after(this.startDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.endDate && date.after(this.startDate) && date.before(this.endDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.startDate) || (this.endDate && date.equals(this.endDate)) || this.isInside(date) || this.isHovered(date);
  }

  increaseResidentsNumber() {
    if (this.residentsNumber < 20) {
      this.residentsNumber++;
    }
  }

  decreaseResidentNumber() {
    if (this.residentsNumber > 1) {
      this.residentsNumber--;
    }
  }

  get location() {
    return this.searchForm.get('location');
  }
}
