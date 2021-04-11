using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication4.Models
{
    public class Sizes
    {
        [Key]
        public int SizeId { get; set; }
        public string Name { get; set; }
        public ICollection<ProductSizes> ProductSizes { get; set; }
    }
}
