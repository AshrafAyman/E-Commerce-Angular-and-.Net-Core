using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication4.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        [Required]
        public string ProductName { get; set; }
        [Required]
        public decimal? ProductPrice { get; set; }
        [Required]
        public int? Qty { get; set; }
        public string Description { get; set; }
        public decimal? Rate { get; set; }
        public DateTime Date {get; set;}
        public bool? InOffer { get; set; }
        public decimal? OfferPrice { get; set; }
        
        [ForeignKey("Category")]
        public int? CategoryId { get; set; }
        [ForeignKey("Washing")]
        public int? WashingId { get; set; }
        [ForeignKey("Shipping")]
        public int? ShippingId { get; set; }
        public ICollection<Reviews> Reviews { get; set; }
        public Category Category { get; set; }
        public Washing Washing { get; set; }
        public Shipping Shipping { get; set; }
        public ICollection<Image> Images { get; set; }
        public ICollection<ProductSizes> ProductSizes { get; set; }
    }
}
