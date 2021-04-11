import { OrderDetailViewModel } from "./orderDetails";

export class OrderModel {
    orderId: number | null;
    orderNo: number | null;
    orderDate: string | null;
    orderTotal: number | null;
    orderTotalNet: number | null;
    orderCount: number | null;
    orderState: number | null;
    orderStateDate: string | null;
    customerId: string;
    isDelete: boolean | null;
    customerName:string | null;
    phone: string | null;
    address:string |null;
    orderDetails: OrderDetailViewModel[];
}