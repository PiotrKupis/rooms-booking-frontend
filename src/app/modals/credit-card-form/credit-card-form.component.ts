import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {ReservationPayload} from "../../models/reservationPayload";
import {ReservationService} from "../../services/reservation.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-credit-card-form',
  templateUrl: './credit-card-form.component.html',
  styleUrls: ['./credit-card-form.component.css']
})
export class CreditCardFormComponent implements OnInit {

  payForm!: FormGroup;
  @Input() reservationPayload!: ReservationPayload;

  constructor(private reservationService: ReservationService,
              private router: Router,
              public activeModal: NgbActiveModal,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.payForm = new FormGroup({
      cardNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9 ]{16,19}$/)]),
      cvv: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{3}$/)]),
      expireMonth: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(12),
        Validators.pattern(/^[1-9]{1,2}$/)]),
      expireYear: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{4}$/)])
    })
  }

  async pay() {
    (<any>window).Stripe.card.createToken({
      number: this.cardNumber?.value,
      exp_month: this.expireMonth?.value,
      exp_year: this.expireYear?.value,
      cvc: this.cvv?.value
    }, (status: number, response: any) => {
      if (status === 200) {
        this.reservationPayload.stripeToken = response.id;
        this.reserve();
      } else {
        console.log(response.error.message);
        this.toastr.error("Nieprawidłowe dane karty kredytowej");
        this.activeModal.close();
      }
    })
  }

  private reserve() {
    this.reservationService.addReservation(this.reservationPayload).subscribe(
      () => {
        this.activeModal.close();
        this.router.navigateByUrl('/');
        this.toastr.success("Zarezerwowano pokój")
      },
      (error) => {
        console.log(error);
        this.activeModal.close();
        this.toastr.error("Wystąpił błąd podczas rezerwacji pokoju")
      }
    )
  }

  get cardNumber() {
    return this.payForm.get('cardNumber');
  }

  get cvv() {
    return this.payForm.get('cvv');
  }

  get expireMonth() {
    return this.payForm.get('expireMonth');
  }

  get expireYear() {
    return this.payForm.get('expireYear');
  }
}
