using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication4.Models
{
    public class Governorate
    {
        [Key]
        public int GovernorateId { get; set; }
        [Required]
        public string GovernorateName { get; set; }
        [ForeignKey("Country")]
        public int? CountryId { get; set; }
        public Country Country { get; set; }
    }
}
