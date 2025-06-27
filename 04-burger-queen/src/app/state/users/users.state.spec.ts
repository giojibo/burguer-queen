import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { UsersState } from './users.state';
import { UsersAction } from './users.actions';

describe('Users actions', () => {
  let store: Store;

  beforeEach(waitForAsync () => {
    void TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UsersState])]
    }).compileComponents();
    store = TestBed.inject(Store);
  }));

  it('should create', () => {
    expect(store).toBeTruthy();
  });

  it('should create an action and add an item', () => {
    store.dispatch(new UsersAction('item-1'));
    store.select(state => state.users.items).subscribe((items: string[]) => {
      expect(items).toEqual(jasmine.objectContaining([ 'item-1' ]));
    });
  });

});
