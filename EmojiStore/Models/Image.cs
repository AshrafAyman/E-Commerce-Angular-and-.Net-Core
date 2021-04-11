using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;

namespace WebApplication4.Models
{
    public class Image
    {
        [Key]
        public int ImgId { get; set; }
        public string ImgPath { get; set; }
        public string ImgType { get; set; }
        [ForeignKey("Customer")]
        public int? CustomerId { get; set; }
        public int? ProductId { get; set; }
        public int? CategoryId { get; set; }
        public Product Product { get; set; }
        public Customer Customer { get; set; }
        public Category Category { get; set; }


    }
}
