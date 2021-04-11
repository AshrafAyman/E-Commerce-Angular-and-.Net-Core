namespace WebApplication4.View_Model
{
    public class CategoryViewModel
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int ImageId { get; set; }
        public string ImagePath { get; set; }
        public string imageBase64 { get; set; }
        public byte[] Image { get; set; }
        public string type { get; set; }
    }
}
