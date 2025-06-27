import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ClearPayment, CreatePaymentSheet } from './stripe.actions';
import { Payment } from 'src/app/models/payment';
import { StripeService } from './stripe.service';

export class StripeStateModel {
  payment: Payment;
}

const defaults = {
  payment: null
};

@State<StripeStateModel>({
  name: 'stripe',
  defaults
})
@Injectable()
export class StripeState {

  @Selector()
  static payment(state: StripeStateModel)
  {
    return state.payment;
  }

  constructor(
    private stripeServices: StripeService,
  ) {}

  @Action(CreatePaymentSheet)
  createPaymentSheet({ setState }: StateContext<StripeStateModel>)
  {
    setState({
      payment: null
    })

  }

  @Action(ClearPayment)
  clearPayment({ setState }: StateContext<StripeStateModel>)
  {
    setState({
      payment: null
    });
  }
}
