/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product} from '../../models/product';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductsService } from '../../services/products.service';
import { CartService } from 'libs/orders/src/lib/services/cart.service';
import { CartItem } from 'libs/orders/src/lib/models/cart';

@Component({
  selector: 'products-product-page',
  templateUrl: './product-page.component.html',
  styles: [
  ]
})
export class ProductPageComponent implements OnInit,OnDestroy {

  product!: Product;
  endSubs$: Subject<any> = new Subject();
  quantity = 1;

  constructor(
    private prodService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params.productid){
        this._getProduct(params.productid);
      }
    })
  }

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity
    }

    this.cartService.setCartItem(cartItem)
  }

  ngOnDestroy():void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
 
  private _getProduct(id: string) {
    this.prodService.getProduct(id).pipe(takeUntil(this.endSubs$)).subscribe(resProduct =>{
      this.product = resProduct;
      console.log(this.product);
    })
  }


}
