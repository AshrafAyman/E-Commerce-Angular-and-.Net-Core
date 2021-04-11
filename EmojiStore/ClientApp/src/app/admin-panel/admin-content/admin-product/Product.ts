import { Category } from '../admin-category/Category';
import { Sizes } from '../admin-size/size';
import { Washing } from '../admin-washing/wash';

// export class Product {
//   productId: number;
//   productName: string;
//   productPrice: number | null;
//   qty: number | null;
//   description: string;
//   rate: number | null;
//   categoryId: number | null;
//   images: string[];
//   productImageList: string[];
//   type: string;
//   types: string[];
//   offerPrice: number | null;
//   inOffer: boolean | null;
//   sizeIdList: number[];
//   washingId: number;
//   washingTitle: string;
//   washingDescription: string;
//   sizeImage: string;
//   sizesList: string[];
//   sizeChartImage: string;
//   productSizesList: Sizes[];
//   categoryName: string;
// }

export class Product {
  productId: number;
  productName: string;
  productPrice: number | null;
  qty: number | null;
  description: string;
  rate: number | null;
  categoryId: number | null;
  images: string[];
  productImageList: string[];
  type: string;
  types: string[];
  offerPrice: number | null;
  inOffer: boolean | null;
  sizeIdList: number[];
  washingId: number;
  washingTitle: string;
  washingDescription: string;
  sizeImage: string;
  sizesList: string[];
  sizeChartImage: string;
  productSizesList: Sizes[];
  productWashingType: Washing;
  categoryName: string;
  shippingValue: string;
  shippingId:number|null;
}
