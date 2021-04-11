import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/admin-panel/admin-content/admin-category/Category';
import { ProductService } from 'src/app/admin-panel/admin-content/admin-product/product.service';
import { CategoryServiceService } from '../../admin-panel/admin-content/admin-category/category-service.service';
@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
})
export class CategoryCardComponent implements OnInit {
  categories: Category[];
  constructor(
    private categorySerivce: CategoryServiceService,
    private productService: ProductService,
    private http: HttpClient,
    private route: Router
  ) { }

  async ngOnInit(): Promise<any> {
    var allCategories = (await this.categorySerivce.GetCategoriesWithImagePath()) as [];
    this.categories = allCategories.slice(0, 9);
  }
  async getProducts(id: Number) { }
}
