import { Offer } from './../admin-offer/offer';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './Product';
import { GetProductViewModel } from './GetProductViewModel';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl: string;
  postProductUrl: string;
  postImageUrl: string;
  bestSellerUrl: string;
  newArrivalUrl: string;
  setOffersUrl: string;
  deleteOffersUrl: string;
  getOffersUrl: string;
  getProductsByCategory: string;
  getSuggestedProducts: string
  constructor(private http: HttpClient) {
    this.baseUrl = 'https://www.emoji-store.com/api/products';
    this.postProductUrl ='https://www.emoji-store.com/api/products/PostProduct';
    this.postImageUrl ='https://www.emoji-store.com/api/products/PostImage';
    this.bestSellerUrl ='https://www.emoji-store.com/api/Products/bestproducts';
    this.newArrivalUrl ='https://www.emoji-store.com/api/Products/newproducts';
    this.setOffersUrl ='https://www.emoji-store.com/api/Products/CreateOffer';
    this.deleteOffersUrl ='https://www.emoji-store.com/api/Products/RemoveOffer';

    this.getProductsByCategory = 'https://www.emoji-store.com/api/Products/GetProductsByFilter';
    this.getSuggestedProducts ='https://www.emoji-store.com/api/Products/GetSuggestedProducts';
  }
  async getProduct(): Promise<any> {
    return await this.http.get<Product[]>(this.baseUrl).toPromise();
  }
  async getSuggestedProduct(id: Number): Promise<any> {
    return await this.http.get<Product[]>(this.getSuggestedProducts + "/" + id).toPromise();
  }
  async getProductByCategoryId(model: GetProductViewModel): Promise<any> {
    return await this.http
      .post<Product[]>(this.getProductsByCategory, model)
      .toPromise();
  }
  async getBestSeller(): Promise<any> {
    return await this.http.get<Product[]>(this.bestSellerUrl).toPromise();
  }
  async getNewArrival(): Promise<any> {
    return await this.http.get<Product[]>(this.newArrivalUrl).toPromise();
  }
  async setOffers(offer: Offer): Promise<any> {
    return await this.http.post(this.setOffersUrl, offer).toPromise();
  }
  async deleteOffers(id: Number): Promise<any> {
    return await this.http.delete(this.deleteOffersUrl + '/' + id).toPromise();
  }
  async getProductById(id: Number): Promise<any> {
    return await this.http.get<Product[]>(this.baseUrl + '/' + id).toPromise();
  }
  async saveProduct(newProduct: Product): Promise<any> {
    return await this.http
      .post<Product>(this.postProductUrl, newProduct)
      .toPromise();
  }
  async saveImages(files: FormData): Promise<any> {
    return await this.http.post(this.postImageUrl, files).toPromise();
  }
  async deleteProduct(id: Number): Promise<any> {
    return await this.http.delete(this.baseUrl + '/' + id).toPromise();
  }
  async editProduct(editedProduct: Product, id: number): Promise<any> {
    return await this.http
      .put<Product>(this.baseUrl + '/' + id, editedProduct)
      .toPromise();
  }
}
