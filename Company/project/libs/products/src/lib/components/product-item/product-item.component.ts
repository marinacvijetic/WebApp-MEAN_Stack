/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CartService } from 'libs/orders/src/lib/services/cart.service';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CartItem } from 'libs/orders/src/lib/models/cart';
@Component({
  selector: 'products-product-item',
  templateUrl: './product-item.component.html',
  styles: [
  ]
})
export class ProductItemComponent implements OnInit {

  @Input() product: Product;

  constructor( private cartService: CartService) { }

  ngOnInit(): void {
    
  }

  
  _addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: 1
    };
    this.cartService.setCartItem(cartItem);
    console.log(cartItem);
  }

}
