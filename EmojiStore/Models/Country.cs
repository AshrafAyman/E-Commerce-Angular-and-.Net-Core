using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication4.Models
{
    public class Country
    {
        [Key]
        public int CountryId { get; set; }
        [Required]
        public string ContryName { get; set; }
        public ICollection<Governorate> Governorates { get; set; }
    }
}
