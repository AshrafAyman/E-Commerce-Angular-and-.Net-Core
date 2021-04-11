using System;
using System.Collections.Generic;

namespace WebApplication4.ViewModel
{
    public class OrderViewModel
    {
        public int? OrderId { get; set; }
        public int? OrderNo { get; set; }
        public DateTime? OrderDate { get; set; }
        public decimal? OrderTotal { get; set; }
        public decimal? OrderTotalNet { get; set; }
        public string ShortDate { get; set; }
        public string RejectionReason { get; set; }
        public string OrderStatus { get; set; }
        public int? OrderCount { get; set; }
        public int? OrderState { get; set; }
        public DateTime? OrderStateDate { get; set; }
        public string CustomerId { get; set; }
        public bool? IsDelete { get; set; }
        public string CustomerName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public List<OrderDetailViewModel> OrderDetails { get; set; }
    }
}
