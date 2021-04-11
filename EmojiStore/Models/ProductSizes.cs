using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication4.Models
{
    public class ProductSizes
    {
        [Key]
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int SizeId { get; set; }
        public Sizes Sizes { get; set; }
        public Product Products { get; set; }

    }
}
