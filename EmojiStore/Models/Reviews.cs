using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;

namespace WebApplication4.Models
{
    public class Reviews
    {
        [Key]
        public int ReviewId { get; set; }
        [Required]
        public string ReviewHeader { get; set; }
        [Required]
        public string ReviewBody { get; set; }
        [Required]
        public decimal? ReviewScore { get; set; }
        [ForeignKey("Product")]
        public int? ProductId { get; set; }
        [ForeignKey("Customer")]
        public int? CustomerId { get; set; }
        public Product Product { get; set; }
        public Customer Customer { get; set; }
       
    }
}
