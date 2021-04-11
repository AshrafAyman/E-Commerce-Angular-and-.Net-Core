using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication4.Models
{
    public class Address
    {
        [Key]
        public int AddressId { get; set; }
        public string City { get; set; }
        public string Block { get; set; }
        public string Street { get; set; }
        public string House { get; set; }
        public int? Floor { get; set; }
        public int? Appartment { get; set; }
        public string AddressInfo { get; set; }
        [ForeignKey("Customer")]
        public int? CustomerId { get; set; }
        [ForeignKey("Governorate")]
        public int? GovernorateId { get; set; }
        [ForeignKey("Country")]
        public int? CountryId { get; set; }
        public Customer Customer { get; set; }
        public Governorate Governorate { get; set; }
        public Country Country { get; set; }
    }
}
