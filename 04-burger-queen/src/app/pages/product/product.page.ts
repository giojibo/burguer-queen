import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { ProductExtraOption } from 'src/app/models/product-extra-option';
import { Product } from 'src/app/models/products';
import { ToastService } from 'src/app/services/toast.service';
import { UserOrderService } from 'src/app/services/user-order.service';
import { GetProductsById } from 'src/app/state/products/products.actions';
import { ProductsState } from 'src/app/state/products/products.state';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: false,
})
export class ProductPage{

  public product: Product;
  public total: number;

  constructor(
    private navParams: NavParams,
    private navController: NavController,
    private store: Store,
    private userOrderServices: UserOrderService,
    private toast: ToastService,
    private translate: TranslateService,
  ) {
    this.product = null;
  }

  ionViewWillEnter()
  {
    console.log(this.navParams.data['product']);
    this.product = this.navParams.data['product'];

    if(this.product && this.product.extras)
    {
      this.total = this.product.price;
    }

    if(!this.product)
    {
      this.navController.navigateForward('categories');
    }
  }


  changeMultipleOption($event, options: ProductExtraOption[])
  {
    console.log($event);

    options.forEach(op => op.activate = $event.detail.value == op.name);

    console.log(options);
    console.log(this.product);
    this.calculateTotal();
  }

  calculateTotal()
  {
    this.total = this.userOrderServices.priceProduct(this.product);
  }

  getProduct($event)
  {
    this.store.dispatch(new GetProductsById({id: this.product._id})).subscribe({
      next: () => {
        this.product = this.store.selectSnapshot(ProductsState.product);
        this.calculateTotal();

      },
      complete: () =>{
        $event.target.complete();
      }
    })
  }
  addProductOrder()
  {
    this.userOrderServices.addProduct(this.product);
    console.log(this.userOrderServices.getProducts());

    this.toast.showToast(
      this.translate.instant('label.product.add.success'),
    );

    this.navController.navigateRoot('/');

  }

}
