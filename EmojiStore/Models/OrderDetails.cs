using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication4.Models
{
    public class OrderDetails
    {
        [Key]
        public int OrderDetailId { get; set; }
        [ForeignKey("Product")]
        public int? ProductId { get; set; }
        public decimal? Price { get; set; }
        public int? Qty { get; set; }
        public decimal? Total { get; set; }
        public decimal? TotalNet { get; set; }
        public string Size { get; set; }
        public bool IsDelete { get; set; }
        [ForeignKey("Order")]
        public int? OrderId { get; set; }
        public Product Product { get; set; }
        public Order Order { get; set; }
    }
}
