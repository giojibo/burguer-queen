import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreateUser, GetUser } from './users.actions';
import { UsersService } from './users.service';
import { User } from 'src/app/models/user';
import { UserOrderService } from 'src/app/services/user-order.service';

export class UsersStateModel {
  success: boolean;
}

const defaults = {
  success: false
};

@State<UsersStateModel>({
  name: 'users',
  defaults
})
@Injectable()
export class UsersState {
  @Selector()
  static success(state: UsersStateModel) {
    return state.success;
  }

  constructor(
    private userServices: UsersService,
    private userorderServices: UserOrderService,
  ) {}

  @Action(GetUser)
  getUser({ }: StateContext<UsersStateModel>, { payload }: GetUser)
  {
    return this.userServices.getUsers(payload.email).then( async (user: User) => {
      await this.userorderServices.saveUser(user);
    })
  }

  @Action(CreateUser)
  createUser({ setState }: StateContext<UsersStateModel>, { payload }: CreateUser)
  {
    return this.userServices.createUser(payload.user).then( async (success: boolean) => {
      setState({
        success
      })
    })
  }
}
