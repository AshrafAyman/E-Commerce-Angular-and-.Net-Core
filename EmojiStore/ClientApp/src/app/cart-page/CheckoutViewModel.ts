import { CheckoutDetailViewModel } from "./CheckoutDetailViewModel";
export class CheckoutViewModel {
  orderId: number;
  orderNo: number | null;
  orderDate: Date | null;
  orderTotal: number | null;
  orderTotalNet: number | null;
  orderCount: number | null;
  orderState: number | null;
  orderStateDate: Date | null;
  customerId: string | null;
  isDelete: boolean;
  phone:string | null;
  customerName:string | null;
  address:string |null;
  orderDetails: CheckoutDetailViewModel[];
}
