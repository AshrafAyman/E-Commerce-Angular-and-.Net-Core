import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from './Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryServiceService {
  baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = '  https://www.emoji-store.com/api/Categories';
  }
  async getCategories(): Promise<any> {
    return await this.http.get<Category[]>(this.baseUrl).toPromise();
  }
  async GetCategoriesWithImagePath(): Promise<any> {
    return await this.http.get<Category[]>(this.baseUrl + "/GetCategoriesWithImagePath").toPromise();
  }
  async getCategoriesHeaders(): Promise<any> {
    return await this.http.get<Category[]>(this.baseUrl + "/GetCategoriesHeaders").toPromise();
  }

  async saveCategory(newCategory: Category): Promise<any> {
    return await this.http
      .post<Category>(this.baseUrl, newCategory)
      .toPromise();
  }
  async deleteCategory(id: Number): Promise<any> {
    return await this.http.delete(this.baseUrl + '/' + id).toPromise();
  }
  async editCategory(editedCategory: Category, id: number): Promise<any> {
    return await this.http
      .put<Category>(this.baseUrl + '/' + id, editedCategory)
      .toPromise();
  }
  async getCategory(id: Number): Promise<any> {
    return await this.http.get(this.baseUrl + '/' + id).toPromise();
  }
  async postFile(fileToUpload: string): Promise<any> {
    const endpoint =
      '  https://www.emoji-store.com/api/Categories/PostImage';
    // const formData: FormData = new FormData();
    // formData.append('Image', fileToUpload);
    return await this.http.post<number>(endpoint, fileToUpload);
  }
}
