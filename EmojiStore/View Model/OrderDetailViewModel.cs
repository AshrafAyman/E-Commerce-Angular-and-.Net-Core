namespace WebApplication4.ViewModel
{
    public class OrderDetailViewModel
    {
        public int? OrderDetailId { get; set; }
        public int? ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal? Price { get; set; }
        public int? Qty { get; set; }
        public decimal? Total { get; set; }
        public decimal? TotalNet { get; set; }
        public int? OrderId { get; set; }
        public bool? IsDelete { get; set; }
        public string ImagePath { get; set; }
        public string Size { get; set; }
    }
}
