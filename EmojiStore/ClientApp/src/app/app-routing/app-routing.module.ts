import { OverViewComponent } from './../admin-panel/admin-content/over-view/over-view.component';
import { AdminWashingComponent } from './../admin-panel/admin-content/admin-washing/admin-washing.component';
import { AdminShippingComponent } from './../admin-panel/admin-content/admin-shipping/admin-shipping.component';
import { AdminSizeComponent } from './../admin-panel/admin-content/admin-size/admin-size.component';
import { CartPageComponent } from './../cart-page/cart-page.component';
import { UserProfileComponent } from './../user-bord/user-bord-content/user-profile/user-profile.component';
import { UserOrderComponent } from './../user-bord/user-bord-content/user-order/user-order.component';
import { UserBordContentComponent } from './../user-bord/user-bord-content/user-bord-content.component';
import { UserBordMainComponent } from './../user-bord/user-bord-main/user-bord-main.component';
import { SignupPageComponent } from './../login-signup/signup-page/signup-page.component';
import { LoginPageComponent } from './../login-signup/login-page/login-page.component';
import { LoginSignupComponent } from './../login-signup/login-signup.component';
import { AdminOfferComponent } from './../admin-panel/admin-content/admin-offer/admin-offer.component';
import { UserProductListComponent } from './../user-product-list/user-product-list.component';
import { AdminContentComponent } from './../admin-panel/admin-content/admin-content.component';
import { AdminMainComponent } from './../admin-panel/admin-main/admin-main.component';
import { AdminProductComponent } from './../admin-panel/admin-content/admin-product/admin-product.component';
import { AdminCategoryComponent } from './../admin-panel/admin-content/admin-category/admin-category.component';
import { PageNotFoundComponent } from './../page-not-found/page-not-found.component';
import { ContentComponent } from './../content/content.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line: quotemark
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component';
import { UserPanelComponent } from '../user-panel/user-panel.component';
import { UserProductComponent } from '../user-product/user-product.component';
import { AdminOrdersComponent } from '../admin-panel/admin-content/admin-orders/admin-orders.component';

const routes: Routes = [
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  {
    path: 'Home',
    component: UserPanelComponent,
    children: [
      {
        path: '',
        component: ContentComponent,
      },

      {
        path: 'Product/:id',
        component: UserProductComponent,
      },
      {
        path: 'ProductList/:id',
        component: UserProductListComponent,
      },
      {
        path: 'ShoppingCart',
        component: CartPageComponent,
      },
    ],
  },

  {
    path: 'Admin',
    component: AdminMainComponent,
    children: [
      {
        path: '',
        component: AdminContentComponent,
      },
      {
        path: 'Category',
        component: AdminCategoryComponent,
      },
      {
        path: 'Product',
        component: AdminProductComponent,
      },
      {
        path: 'Offer',
        component: AdminOfferComponent,
      },
      {
        path: 'Size',
        component: AdminSizeComponent,
      },
      {
        path: 'Shipping',
        component: AdminShippingComponent,
      },
      {
        path: 'Washing',
        component: AdminWashingComponent,
      },
      {
        path: 'Orders',
        component: AdminOrdersComponent,
      },
      {
        path: 'OverView',
        component: OverViewComponent,
      },
    ],
  },
  {
    path: 'User',
    component: UserBordMainComponent,
    children: [
      {
        path: '',
        component: UserBordContentComponent,
      },
      {
        path: 'MyOrder',
        component: UserOrderComponent,
      },
      {
        path: 'Profile',
        component: UserProfileComponent,
      },
    ],
  },
  {
    path: 'Registration',
    component: LoginSignupComponent,
    children: [
      {
        path: '',
        component: LoginPageComponent,
      },
      {
        path: 'Login',
        component: LoginPageComponent,
      },
      {
        path: 'Signup',
        component: SignupPageComponent,
      },
    ],
  },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
