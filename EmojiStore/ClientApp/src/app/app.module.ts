import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { OwlModule } from 'ngx-owl-carousel';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';
import { CategoryCardComponent } from './content/category-card/category-card.component';
import { BestSellerComponent } from './content/best-seller/best-seller.component';
import { BestSeller2Component } from './content/best-seller2/best-seller2.component';
import { WeekOfferComponent } from './content/week-offer/week-offer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// tslint:disable-next-line: quotemark
import { AppRoutingModule } from './app-routing/app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminMainComponent } from './admin-panel/admin-main/admin-main.component';
import { AdminContentComponent } from './admin-panel/admin-content/admin-content.component';
import { AdminProductComponent } from './admin-panel/admin-content/admin-product/admin-product.component';
import { AdminCategoryComponent } from './admin-panel/admin-content/admin-category/admin-category.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxPopper } from 'angular-popper';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { ScrollService } from '../app/_services/scroll.service';
import { UserProductComponent } from './user-product/user-product.component';
import { UserProductMainComponent } from './user-product/user-product-main/user-product-main.component';
import { UserProductCarouselComponent } from './user-product/user-product-carousel/user-product-carousel.component';
import { UserProductListComponent } from './user-product-list/user-product-list.component';
import { AdminOfferComponent } from './admin-panel/admin-content/admin-offer/admin-offer.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { LoginPageComponent } from './login-signup/login-page/login-page.component';
import { SignupPageComponent } from './login-signup/signup-page/signup-page.component';
import { UserBordComponent } from './user-bord/user-bord.component';
import { UserBordMainComponent } from './user-bord/user-bord-main/user-bord-main.component';
import { UserBordContentComponent } from './user-bord/user-bord-content/user-bord-content.component';
import { UserOrderComponent } from './user-bord/user-bord-content/user-order/user-order.component';
import { UserProfileComponent } from './user-bord/user-bord-content/user-profile/user-profile.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AdminSizeComponent } from './admin-panel/admin-content/admin-size/admin-size.component';
import { AdminShippingComponent } from './admin-panel/admin-content/admin-shipping/admin-shipping.component';
import { AdminWashingComponent } from './admin-panel/admin-content/admin-washing/admin-washing.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminOrdersComponent } from './admin-panel/admin-content/admin-orders/admin-orders.component';
import { OverViewComponent } from './admin-panel/admin-content/over-view/over-view.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    CategoryCardComponent,
    BestSellerComponent,
    BestSeller2Component,
    WeekOfferComponent,
    PageNotFoundComponent,
    AdminPanelComponent,
    AdminMainComponent,
    AdminContentComponent,
    AdminProductComponent,
    AdminCategoryComponent,
    UserPanelComponent,
    UserProductComponent,
    UserProductMainComponent,
    UserProductCarouselComponent,
    UserProductListComponent,
    AdminOfferComponent,
    LoginSignupComponent,
    LoginPageComponent,
    SignupPageComponent,
    UserBordComponent,
    UserBordMainComponent,
    UserBordContentComponent,
    UserOrderComponent,
    UserProfileComponent,
    CartPageComponent,
    AdminSizeComponent,
    AdminShippingComponent,
    AdminWashingComponent,
    AdminOrdersComponent,
    OverViewComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CarouselModule,
    OwlModule,
    FormsModule,
    AppRoutingModule,
    DataTablesModule.forRoot(),
    NgxPopper,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxPaginationModule,
  ],
  providers: [ScrollService],
  bootstrap: [AppComponent],
})
export class AppModule {}
