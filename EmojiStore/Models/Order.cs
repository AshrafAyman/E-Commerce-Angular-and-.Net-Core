using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApplication4.Data;

namespace WebApplication4.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }
        public int? OrderNo { get; set; }
        public DateTime? OrderDate { get; set; }
        public decimal? OrderTotal { get; set; }
        public decimal? OrderTotalNet { get; set; }
        public int? OrderCount { get; set; }
        public int? OrderState { get; set; }
        public DateTime? OrderStateDate { get; set; }
        public bool IsDelete { get; set; }
        public string RejectionReason { get; set; }
        public string PhoneNumber { get; set; }
        public string CustomerName { get; set; }
        public string Address { get; set; }

        [ForeignKey("Customer")]
        public string CustomerId { get; set; }
        public ApplicationUser Customer { get; set; }
        public ICollection<OrderDetails> OrderDetails { get; set; }
    }
}
