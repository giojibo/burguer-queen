import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreateOrder } from './orders.actions';
import { OrderService } from './order.service';


export class OrdersStateModel {
  success: boolean;
}

const defaults = {
  success : false,
};

@State<OrdersStateModel>({
  name: 'orders',
  defaults
})
@Injectable()
export class OrdersState {

  @Selector()
  static success(state: OrdersStateModel): boolean {
    return state.success;
  }

  constructor(
    private ordersServices: OrderService,
  ) {}

  @Action(CreateOrder)
  add({ getState, setState }: StateContext<OrdersStateModel>, { payload }: CreateOrder) {

    return this.ordersServices.createOrder(payload.order).then(
      (success: boolean) => {
        setState({
          success
        });
      }
    )
  }
}
