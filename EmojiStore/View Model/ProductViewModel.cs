using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using WebApplication4.Models;

namespace WebApplication4.View_Model
{
    public class ProductViewModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal? ProductPrice { get; set; }
        public int? Qty { get; set; }
        public string Description { get; set; }
        public decimal? Rate { get; set; }
        public int? CategoryId { get; set; }
        public List<string> Images { get; set; }
        public List<byte[]> ProductImageList { get; set; }
        public string type {get; set;}
        public List<string> Types { get; set; }
        public decimal? OfferPrice { get; set; }
        public bool? inOffer { get; set; }
        public List<int> SizeIdList { get; set; }
        public int WashingId { get; set; }
        public string WashingTitle { get; set; }
        public string WashingDescription { get; set; }
        public string SizeImage { get; set; }
        public List<string> SizesList { get; set; }
        public byte[] SizeChartImage { get; set; }
        public List<Sizes> ProductSizesList { get; set; }
        public Washing ProductWashingType { get; set; }
        public string CategoryName { get; set; }
        public string ShippingValue { get; set; }
        public int ShippingId { get; set; }

    }
}
