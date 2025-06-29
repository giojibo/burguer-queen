import { Component, OnInit } from '@angular/core';
//import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Selector, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { CreatePaymentIntent } from 'src/app/models/create-payment-intent';
import { Payment } from 'src/app/models/payment';
import { ToastService } from 'src/app/services/toast.service';
import { UserOrderService } from 'src/app/services/user-order.service';
import { CreateOrder } from 'src/app/state/orders/orders.actions';
import { OrdersState } from 'src/app/state/orders/orders.state';
import { ClearPayment, CreatePaymentSheet } from 'src/app/state/stripe/stripe.actions';
import { StripeState } from 'src/app/state/stripe/stripe.state';
import { environment } from 'src/environments/environment';

declare var paypal: any;

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
  standalone: false,
})
export class PayPage
{

  @Select(StripeState.payment)

  private payment$: Observable<Payment>;


  public showNewAccount: boolean;
  public step: number;
  public optionAdress: string;
  public showNewAddress: boolean;
  public address: string;
  public suscription: Subscription;



  constructor(
    public userOrderService: UserOrderService,
    private navController: NavController,
    private store: Store,
    private toast: ToastService,
    private translate: TranslateService,
  )
  {}

  async ionViewWillEnter()
  {
    this.showNewAccount = false;
    this.step = 1;
    this.suscription = new Subscription();
    this.optionAdress = 'address-default';
    this.showNewAddress = false;
    this.changeOptionAddress();

    //this.detectChangesPayment();
    this.loadPayPalButton();

  }

  newAccount()
  {
    this.showNewAccount = true;
  }

  showLogin()
  {
    this.showNewAccount = false;
  }

  nextStep()
  {
    this.step++;

    if(this.step === 3)
  {
    setTimeout(() => this.loadPayPalButton(), 200); // pequeño delay
  }
  }

  previousStep()
  {
    this.step--;
  }

  backHome()
  {
    this.navController.navigateForward('categories');
  }
  changeOptionAddress()
  {
    switch(this.optionAdress)
    {
      case 'address-default':
        this.showNewAddress = false;
        this.address = this.userOrderService.getUser().address;
        break;

      case 'choose-address':
        this.showNewAddress = true;
        this.address = '';
        break;
    }
  }

  /* payWithStripe()
  {
    const total = this.userOrderService.totalOrder() * 100;

    const paymentIntent: CreatePaymentIntent =
    {
      secretKey: environment.secretKey,
      amount: +total.toFixed(0),
      currency: 'EUR',
      customer_id: '',
    };

    this.store.dispatch( new CreatePaymentSheet({ paymentIntent }) );
  } */

  createOrder()
  {
    const order = this.userOrderService.getOrder();
    order.address = this.address;

    this.store.dispatch( new CreateOrder({order})).subscribe(
      {
        next: () =>
        {
          const success = this.store.selectSnapshot(OrdersState.success);
          if(success)
          {
            this.toast.showToast(this.translate.instant('label.pay.success', {'address': this.address}));
            this.userOrderService.reserOrder();
            this.navController.navigateForward('categories');
          }
          else
          {
            this.toast.showToast(this.translate.instant('label.pay.fail'));
          }
        }, error: (err)=>
        {
          console.error(err);
          this.toast.showToast(this.translate.instant('label.pay.fail'));
        }
      }
    )
  }

  /* detectChangesPayment() {
    const sub = this.payment$.subscribe({
      next: () => {
        const payment = this.store.selectSnapshot(StripeState.payment);
        if (payment) {
          Stripe.createPaymentSheet({
            ...payment,
            merchantDisplayName: 'DDR'
          });
          Stripe.presentPaymentSheet().then((result) => {
            console.log(result);
            if (result.paymentResult == PaymentSheetEventsEnum.Completed) {
              this.createOrder();
            } else if (result.paymentResult == PaymentSheetEventsEnum.Failed) {
              this.toast.showToast(
                this.translate.instant('label.pay.fail')
              );
            }
          })
        }
      }
    });
    this.suscription.add(sub);
  } */

  async loadPayPalButton() {
    const total = this.userOrderService.totalOrder().toFixed(2);

    try {
      await this.loadPayPalScript(); // Espera a que cargue el SDK

      const container = document.getElementById('paypal-button-container');
      if (!container) {
        console.warn('Contenedor PayPal no encontrado');
        return;
      }

      container.innerHTML = ''; // Limpia botones viejos

      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total,
                currency_code: 'EUR'
              }
            }],
            application_context: {
              shipping_preference: 'NO_SHIPPING'
            }
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            this.toast.showToast(`Pago completado por ${details.payer.name.given_name}`);
            this.createOrder();
          });
        },
        onCancel: () => {
          this.toast.showToast(this.translate.instant('label.pay.cancelled') || 'Pago cancelado');
        },
        onError: (err: any) => {
          console.error('Error en PayPal:', err);
          this.toast.showToast(this.translate.instant('label.pay.fail'));
        }
      }).render('#paypal-button-container');

    } catch (e) {
      this.toast.showToast('Error al cargar PayPal');
    }
  }


  ionViewWllLeave()
  {
    this.store.dispatch( new ClearPayment());
    this.suscription.unsubscribe();
  }

  loadPayPalScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((<any>window).paypal) {
      // Ya está cargado
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AfRGr1yIWilSw6YfbZfB8PqWLRQI6gMB2R-SI8vOOcy_Vd0G8bolmjiN0IAmVoHUCn5ZHFFiNkqdB1Js&currency=EUR';
    script.onload = () => {
      console.log('PayPal SDK cargado');
      resolve();
    };
    script.onerror = (err) => {
      console.error('Error al cargar PayPal SDK', err);
      reject();
    };
    document.body.appendChild(script);
  });
}


}
