using ImageMagick;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using WebApplication4.Data;
using WebApplication4.Models;
using WebApplication4.View_Model;
using Image = WebApplication4.Models.Image;

namespace WebApplication4.Repositories
{
    public interface IProduct
    {
        List<ProductViewModel> GetAllProducts();
        void AddProduct(ProductViewModel product);
        void EditProduct(ProductViewModel product);
        bool DeleteProduct(int id);
        bool DeleteProductImage(int id);
        List<ProductViewModel> NewProducts();
        List<ProductViewModel> BestReviewedProducts();
        ProductViewModel GetProductById(int id);
        bool SetOffer(OfferViewModel product);
        bool RemoveOffer(int id);
        ProductViewModel GetOffer();
        List<ProductViewModel> GetProductsByFilter(GetProductViewModel model);
        List<ProductViewModel> GetSuggestedProducts(int id);
        FileInfo GetExcelFile();

    }
    public class ProductRepo : IProduct
    {
        private UserManager<ApplicationUser> _userManager;
        ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ProductRepo(UserManager<ApplicationUser> userManager, ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
            _userManager = userManager;


        }
        public List<ProductViewModel> GetAllProducts()
        {
            List<ProductViewModel> productsList = new List<ProductViewModel>();

            var products = _context.Products.ToList();
            foreach (var product in products)
            {
                var wash = _context.Washings.FirstOrDefault(e => e.Id == product.WashingId);
                var ship = _context.Shippings.FirstOrDefault(e => e.Id == product.ShippingId);


                var productSizes = _context.ProductSizes.Where(e => e.ProductId == product.ProductId).Select(e => e.SizeId).ToList();
                List<Sizes> productSizesList = new List<Sizes>();
                foreach (var productSize in productSizes)
                {
                    var sizes = _context.Sizes.Where(e => e.SizeId == productSize).ToList();
                    foreach (var size in sizes)
                    {
                        productSizesList.Add(size);
                    }
                }

                //Return product images
                var productImagePathes = _context.Image.Where(e => e.ProductId == product.ProductId && e.ImgType == null).Select(e => e.ImgPath).ToList();
                List<byte[]> productImages = new List<byte[]>();
                List<string> types = new List<string>();
                foreach (var imagePath in productImagePathes)
                {
                    var image = File.ReadAllBytes(imagePath);
                    var type = GetFile(imagePath);
                    types.Add(type);
                    productImages.Add(image);
                }

                // Return size chart image
                var sizeImagePathes = _context.Image.FirstOrDefault(e => e.ProductId == product.ProductId && e.ImgType == "Size Image")?.ImgPath;
                byte[] sizeImage = null;
                string sizeImageType = null;
                if (sizeImagePathes != null)
                {
                    sizeImage = File.ReadAllBytes(sizeImagePathes);
                    sizeImageType = GetFile(sizeImagePathes);
                }
                ProductViewModel productModel = new ProductViewModel();
                productModel.ProductId = product.ProductId;
                productModel.ProductName = product.ProductName;
                productModel.ProductPrice = product.ProductPrice;
                productModel.CategoryId = product.CategoryId;
                productModel.Qty = product.Qty;
                productModel.Description = product.Description;
                productModel.Rate = product.Rate;
                productModel.ProductImageList = productImages;
                productModel.OfferPrice = product.OfferPrice;
                productModel.inOffer = product.InOffer;
                productModel.Types = types;
                productModel.type = sizeImageType;
                productModel.SizeChartImage = sizeImage;
                productModel.ProductWashingType = wash;
                productModel.WashingId = Convert.ToInt32(product.WashingId);
                productModel.WashingTitle = wash.Title;
                productModel.WashingDescription = wash.Description;
                productModel.ProductSizesList = productSizesList;
                productModel.SizeIdList = productSizesList.Select(e => e.SizeId).ToList();
                productModel.ShippingId = ship.Id;
                productsList.Add(productModel);
            }
            return productsList;
        }
        public void AddProduct(ProductViewModel product)
        {
            int imgId = 0;
            if (product.SizeImage != null && product.type != null)
            {
                imgId = this.SaveSizeImage(product.SizeImage, product.type);
            }
            Product newProduct = new Product();
            newProduct.ProductName = product.ProductName;
            newProduct.ProductPrice = product.ProductPrice;
            newProduct.Qty = product.Qty;
            newProduct.Rate = product.Rate;
            newProduct.CategoryId = product.CategoryId;
            newProduct.Description = product.Description;
            newProduct.Date = DateTime.Now;
            newProduct.WashingId = product.WashingId;
            newProduct.ShippingId = product.ShippingId;
            _context.Products.Add(newProduct);
            _context.SaveChanges();
            if (imgId != 0 && imgId != null)
            {
                var sizeImg = _context.Image.FirstOrDefault(e => e.ImgId == imgId);
                sizeImg.ProductId = newProduct.ProductId;
                _context.SaveChanges();
            }
            if (product.SizeIdList != null)
            {
                foreach (var size in product.SizeIdList)
                {
                    var result = _context.Sizes.FirstOrDefault(e => e.SizeId == size);
                    if (result != null)
                    {
                        ProductSizes productSizes = new ProductSizes
                        {
                            ProductId = newProduct.ProductId,
                            SizeId = result.SizeId
                        };
                        _context.ProductSizes.Add(productSizes);
                        _context.SaveChanges();
                    }
                }
            }
            if (product.Images != null && product.Types != null)
            {
                var imageListId = this.SaveBase64Images(product.Images, product.Types);
                foreach (var id in imageListId)
                {
                    _context.Image.FirstOrDefault(e => e.ImgId == id).ProductId = newProduct.ProductId;
                    _context.SaveChanges();
                }
            }
        }

        public bool DeleteProduct(int id)
        {
            var result = this.DeleteProductImage(id);
            if (result == true)
            {
                var productOrderDetails = _context.OrderDetails.Where(e => e.ProductId == id).ToList();
                if (productOrderDetails != null)
                {
                    foreach (var productOrder in productOrderDetails)
                    {
                        _context.OrderDetails.Remove(productOrder);
                        _context.SaveChanges();
                    }
                }
                var product = _context.Products.Find(id);
                if (product != null)
                {
                    _context.Products.Remove(product);
                    _context.SaveChanges();
                }
                var productSizes = _context.ProductSizes.Where(e => e.ProductId == id);
                foreach (var productSize in productSizes)
                {
                    _context.ProductSizes.Remove(productSize);
                    _context.SaveChanges();
                }
                
                return true;
            }

            return false;
        }

        public void EditProduct(ProductViewModel product)
        {
            if (product.Images != null)
            {
                var images = _context.Image.Where(a => a.ProductId == product.ProductId && a.ImgType == null);
                if (images != null)
                {
                    foreach (var image in images)
                    {
                        File.Delete(image.ImgPath);
                        _context.Image.Remove(image);
                    }
                    _context.SaveChanges();
                }
            }
            if (product.SizeImage != "")
            {
                var img = _context.Image.FirstOrDefault(a => a.ProductId == product.ProductId && a.ImgType == "Size Image");
                if (img != null)
                {
                    File.Delete(img.ImgPath);
                    _context.Image.Remove(img);
                    _context.SaveChanges();
                }
            }
            if (product.SizeIdList != null)
            {
                var productSizes = _context.ProductSizes.Where(e => e.ProductId == product.ProductId).ToList();
                for (int i = 0; i < productSizes.Count; i++)
                {
                    _context.ProductSizes.Remove(productSizes[i]);
                }
                _context.SaveChanges();
            }
            
            if (product.SizeImage != "" && product.type != "")
            {
                var imgId = this.SaveSizeImage(product.SizeImage, product.type);
                var sizeImg = _context.Image.FirstOrDefault(e => e.ImgId == imgId && e.ImgType == "Size Image");
                sizeImg.ProductId = product.ProductId;
                _context.SaveChanges();
            }
            var editedProduct = _context.Products.FirstOrDefault(e => e.ProductId == product.ProductId);
            if (editedProduct != null)
            {
                editedProduct.ProductName = product.ProductName;
                editedProduct.ProductPrice = product.ProductPrice;
                editedProduct.Qty = product.Qty;
                editedProduct.Rate = product.Rate;
                editedProduct.CategoryId = product.CategoryId;
                editedProduct.Description = product.Description;
                editedProduct.Date = DateTime.Now;
                editedProduct.WashingId = product.WashingId;
                editedProduct.ShippingId = product.ShippingId;
                _context.SaveChanges();
                
            }
            foreach (var size in product.SizeIdList)
            {
                var result = _context.Sizes.FirstOrDefault(e => e.SizeId == size);
                if (result != null)
                {
                    ProductSizes productSizes = new ProductSizes
                    {
                        ProductId = editedProduct.ProductId,
                        SizeId = result.SizeId
                    };
                    _context.ProductSizes.Add(productSizes);
                    _context.SaveChanges();
                }
            }
            var imageListId = this.SaveBase64Images(product.Images, product.Types);
            foreach (var id in imageListId)
            {
                _context.Image.FirstOrDefault(e => e.ImgId == id).ProductId = editedProduct.ProductId;
                _context.SaveChanges();
            }
        }

        public bool DeleteProductImage(int id)
        {
            var images = _context.Image.Where(a => a.ProductId == id).ToList();
            if (images != null)
            {
                foreach (var image in images)
                {
                    File.Delete(image.ImgPath);
                    _context.Image.Remove(image);
                    _context.SaveChanges();
                }

                return true;
            }
            return false;
        }

        public List<ProductViewModel> NewProducts()
        {
            var products = _context.Products.OrderBy(x => x.Date).Take(10).ToList();
            List<ProductViewModel> productsList = new List<ProductViewModel>();
            foreach (var product in products)
            {
                var wash = _context.Washings.FirstOrDefault(e => e.Id == product.WashingId);

                var productSizes = _context.ProductSizes.Where(e => e.ProductId == product.ProductId).Select(e => e.SizeId).ToList();
                List<Sizes> productSizesList = new List<Sizes>();
                foreach (var productSize in productSizes)
                {
                    var sizes = _context.Sizes.Where(e => e.SizeId == productSize).ToList();
                    foreach (var size in sizes)
                    {
                        productSizesList.Add(size);
                    }
                }
                //Return product images
                var productImagePathes = _context.Image.Where(e => e.ProductId == product.ProductId && e.ImgType == null).Select(e => e.ImgPath).ToList();
                List<byte[]> productImages = new List<byte[]>();
                List<string> types = new List<string>();
                foreach (var imagePath in productImagePathes)
                {
                    var image = File.ReadAllBytes(imagePath);
                    var type = GetFile(imagePath);
                    types.Add(type);
                    productImages.Add(image);
                }

                // Return size chart image
                var sizeImagePathes = _context.Image.FirstOrDefault(e => e.ProductId == product.ProductId && e.ImgType == "Size Image").ImgPath;
                var sizeImage = File.ReadAllBytes(sizeImagePathes);
                var sizeImageType = GetFile(sizeImagePathes);

                ProductViewModel productModel = new ProductViewModel();
                productModel.ProductId = product.ProductId;
                productModel.ProductName = product.ProductName;
                productModel.ProductPrice = product.ProductPrice;
                productModel.CategoryId = product.CategoryId;
                productModel.Qty = product.Qty;
                productModel.Description = product.Description;
                productModel.Rate = product.Rate;
                productModel.ProductImageList = productImages;
                productModel.OfferPrice = product.OfferPrice;
                productModel.inOffer = product.InOffer;
                productModel.Types = types;
                productModel.type = sizeImageType;
                productModel.SizeChartImage = sizeImage;
                productModel.ProductWashingType = wash;
                productModel.WashingId = Convert.ToInt32(product.WashingId);
                productModel.WashingTitle = wash.Title;
                productModel.WashingDescription = wash.Description;
                productModel.ProductSizesList = productSizesList;
                productsList.Add(productModel);
            }
            return productsList;
        }

        public List<ProductViewModel> BestReviewedProducts()
        {
            var products = _context.Products.Include(e => e.Reviews).OrderBy(e => e.Reviews.Count).Take(10).ToList();
            List<ProductViewModel> productsList = new List<ProductViewModel>();
            foreach (var product in products)
            {
                var wash = _context.Washings.FirstOrDefault(e => e.Id == product.WashingId);

                var productSizes = _context.ProductSizes.Where(e => e.ProductId == product.ProductId).Select(e => e.SizeId).ToList();
                List<Sizes> productSizesList = new List<Sizes>();
                foreach (var productSize in productSizes)
                {
                    var sizes = _context.Sizes.Where(e => e.SizeId == productSize).ToList();
                    foreach (var size in sizes)
                    {
                        productSizesList.Add(size);
                    }
                }
                //Return product images
                var productImagePathes = _context.Image.Where(e => e.ProductId == product.ProductId && e.ImgType == null).Select(e => e.ImgPath).ToList();
                List<byte[]> productImages = new List<byte[]>();
                List<string> types = new List<string>();
                foreach (var imagePath in productImagePathes)
                {
                    var image = File.ReadAllBytes(imagePath);
                    var type = GetFile(imagePath);
                    types.Add(type);
                    productImages.Add(image);
                }

                // Return size chart image
                var sizeImagePathes = _context.Image.FirstOrDefault(e => e.ProductId == product.ProductId && e.ImgType == "Size Image").ImgPath;
                var sizeImage = File.ReadAllBytes(sizeImagePathes);
                var sizeImageType = GetFile(sizeImagePathes);

                ProductViewModel productModel = new ProductViewModel();
                productModel.ProductId = product.ProductId;
                productModel.ProductName = product.ProductName;
                productModel.ProductPrice = product.ProductPrice;
                productModel.CategoryId = product.CategoryId;
                productModel.Qty = product.Qty;
                productModel.Description = product.Description;
                productModel.Rate = product.Rate;
                productModel.ProductImageList = productImages;
                productModel.OfferPrice = product.OfferPrice;
                productModel.inOffer = product.InOffer;
                productModel.Types = types;
                productModel.type = sizeImageType;
                productModel.SizeChartImage = sizeImage;
                productModel.ProductWashingType = wash;
                productModel.WashingId = Convert.ToInt32(wash.Id);
                productModel.WashingTitle = wash.Title;
                productModel.WashingDescription = wash.Description;
                productModel.ProductSizesList = productSizesList;
                productsList.Add(productModel);
            }
            return productsList;
        }

        public ProductViewModel GetProductById(int id)
        {
            var product = _context.Products.Include(e => e.Washing).FirstOrDefault(e => e.ProductId == id);
            var shipping = _context.Shippings.FirstOrDefault(e=>e.Id == product.ShippingId)?.Name;
            var productSizes = _context.ProductSizes.Where(e => e.ProductId == id).Select(e => e.SizeId);
            List<Sizes> productSizesList = new List<Sizes>();
            productSizesList = _context.Sizes.Where(e => productSizes.Contains(e.SizeId)).ToList();
            //foreach (var productSize in productSizes)
            //{
            //    var sizes = _context.Sizes.Where(e => e.SizeId == productSize).ToList();
            //    foreach (var size in sizes)
            //    {
            //        productSizesList.Add(size);
            //    }
            //}
            //Return product images
            var productImagePathes = _context.Image.Where(e => e.ProductId == id && e.ImgType == null).Select(e => e.ImgPath).ToList();
            List<byte[]> productImages = new List<byte[]>();
            List<string> types = new List<string>();
            foreach (var imagePath in productImagePathes)
            {
                var image = File.ReadAllBytes(imagePath);
                var type = GetFile(imagePath);
                types.Add(type);
                productImages.Add(image);
            }

            // Return size chart image
            var sizeImagePathes = _context.Image.FirstOrDefault(e => e.ProductId == id && e.ImgType == "Size Image")?.ImgPath;
            byte[] sizeImage = null;
            var sizeImageType = "";
            if (sizeImagePathes != null)
            {
                 sizeImage = File.ReadAllBytes(sizeImagePathes);
                 sizeImageType = GetFile(sizeImagePathes);
            }
            

            ProductViewModel productModel = new ProductViewModel();
            productModel.ProductId = product.ProductId;
            productModel.ProductName = product.ProductName;
            productModel.ProductPrice = product.ProductPrice;
            productModel.CategoryId = product.CategoryId;
            productModel.Qty = product.Qty;
            productModel.Description = product.Description;
            productModel.Rate = product.Rate;
            productModel.ProductImageList = productImages;
            productModel.OfferPrice = product.OfferPrice;
            productModel.inOffer = product.InOffer;
            productModel.Types = types;
            productModel.type = sizeImageType;
            productModel.SizeChartImage = sizeImage;
            productModel.WashingTitle = product.Washing.Title;
            productModel.WashingDescription = product.Washing.Description;
            productModel.ProductSizesList = productSizesList;
            productModel.ShippingValue = shipping;
            return productModel;
        }

        private string GetFile(string path)
        {
            string contentType;
            new FileExtensionContentTypeProvider().TryGetContentType(path, out contentType);
            return contentType ?? "application/octet-stream";
        }

        public bool SetOffer(OfferViewModel product)
        {
            var editedProduct = _context.Products.FirstOrDefault(e => e.ProductId == product.ProductId);
            if (editedProduct != null)
            {
                editedProduct.InOffer = true;
                editedProduct.OfferPrice = Convert.ToDecimal(product.OfferPrice);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool RemoveOffer(int id)
        {
            var editedProduct = _context.Products.FirstOrDefault(e => e.ProductId == id);
            if (editedProduct != null)
            {
                editedProduct.InOffer = false;
                editedProduct.OfferPrice = null;
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public ProductViewModel GetOffer()
        {
            var offeredProduct = _context.Products.AsEnumerable().LastOrDefault(e => e.InOffer == true);
            var productImage = _context.Image.FirstOrDefault(e => e.ProductId == offeredProduct.ProductId && e.ImgType == null).ImgPath;

            List<byte[]> pathes = new List<byte[]>();
            var image = File.ReadAllBytes(productImage);
            pathes.Add(image);
            var type = GetFile(productImage);

            ProductViewModel productModel = new ProductViewModel();
            productModel.ProductId = offeredProduct.ProductId;
            productModel.CategoryId = offeredProduct.CategoryId;
            productModel.Description = offeredProduct.Description;
            productModel.ProductName = offeredProduct.ProductName;
            productModel.ProductPrice = offeredProduct.ProductPrice;
            productModel.OfferPrice = offeredProduct.OfferPrice;
            productModel.Qty = offeredProduct.Qty;
            productModel.Rate = offeredProduct.Rate;
            productModel.inOffer = offeredProduct.InOffer;
            productModel.ProductImageList = pathes;
            productModel.type = type;

            return productModel;
        }
        public List<ProductViewModel> GetProductsByFilter(GetProductViewModel model)
        {
            var test = model;
            List<ProductViewModel> productsList = new List<ProductViewModel>();
            var products = _context.Products.ToList();
            if (model.CategoryId != null)
            {
                products = products.Where(e => e.CategoryId == model.CategoryId).ToList();
            }
            if (!string.IsNullOrEmpty(model.SearchText))
            {

                products = products.Where(e => e.ProductName.ToLower().Contains(model.SearchText.ToLower())).ToList();
            }
            if (model.Filter != 1)
            {
                if (model.Filter == Filtration.FormHighPriceToLowPrice)
                {
                    products = products.OrderBy(e => e.ProductPrice).ToList();
                }
                if (model.Filter == Filtration.FromLowPriceToHigherPrice)
                {
                    products = products.OrderByDescending(e => e.ProductPrice).ToList();
                }
                if (model.Filter == Filtration.FromAToZ)
                {
                    products = products.OrderBy(e => e.ProductName).ToList();
                }
                if (model.Filter == Filtration.FormZToA)
                {
                    products = products.OrderByDescending(e => e.ProductName).ToList();
                }
                if (model.Filter == Filtration.FromNewerToOlder)
                {
                    products = products.OrderBy(e => e.Date).ToList();
                }
                if (model.Filter == Filtration.FromOlderToNewer)
                {
                    products = products.OrderByDescending(e => e.Date).ToList();
                }
                //if (model.Filter == Filtration.NoFilter)
                //{
                //    products = _context.Products.ToList();
                //}

            }
            foreach (var product in products)
            {
                var wash = _context.Washings.FirstOrDefault(e => e.Id == product.WashingId);
                var categoryName = _context.Categories.FirstOrDefault(e => e.CategoryId == product.CategoryId)?.CategoryName;
                var productSizes = _context.ProductSizes.Where(e => e.ProductId == product.ProductId).Select(e => e.SizeId).ToList();
                List<Sizes> productSizesList = new List<Sizes>();
                foreach (var productSize in productSizes)
                {
                    var sizes = _context.Sizes.Where(e => e.SizeId == productSize).ToList();
                    foreach (var size in sizes)
                    {
                        productSizesList.Add(size);
                    }
                }

                //Return product images
                var productImagePathes = _context.Image.Where(e => e.ProductId == product.ProductId && e.ImgType == null).Select(e => e.ImgPath).ToList();
                List<byte[]> productImages = new List<byte[]>();
                List<string> types = new List<string>();
                foreach (var imagePath in productImagePathes)
                {
                    var image = File.ReadAllBytes(imagePath);
                    var type = GetFile(imagePath);
                    types.Add(type);
                    productImages.Add(image);
                }

                // Return size chart image
                var sizeImagePathes = _context.Image.FirstOrDefault(e => e.ProductId == product.ProductId && e.ImgType == "Size Image")?.ImgPath;
                byte[] sizeImage = null;
                string sizeImageType = null;
                if (sizeImagePathes != null)
                {
                    sizeImage = File.ReadAllBytes(sizeImagePathes);
                    sizeImageType = GetFile(sizeImagePathes);
                }
                ProductViewModel productModel = new ProductViewModel();
                productModel.ProductId = product.ProductId;
                productModel.ProductName = product.ProductName;
                productModel.ProductPrice = product.ProductPrice;
                productModel.CategoryId = product.CategoryId;
                productModel.Qty = product.Qty;
                productModel.Description = product.Description;
                productModel.Rate = product.Rate;
                productModel.ProductImageList = productImages;
                productModel.OfferPrice = product.OfferPrice;
                productModel.inOffer = product.InOffer;
                productModel.Types = types;
                productModel.type = sizeImageType;
                productModel.SizeChartImage = sizeImage;
                productModel.ProductWashingType = wash;
                productModel.WashingId = Convert.ToInt32(product.WashingId);
                productModel.WashingTitle = wash.Title;
                productModel.WashingDescription = wash.Description;
                productModel.ProductSizesList = productSizesList;
                productModel.SizeIdList = productSizesList.Select(e => e.SizeId).ToList();
                productModel.CategoryName = categoryName;
                productsList.Add(productModel);
            }
            return productsList;
        }
        public List<ProductViewModel> GetSuggestedProducts(int id)
        {
            List<ProductViewModel> productsList = new List<ProductViewModel>();
            var categoryId = _context.Products.FirstOrDefault(e => e.ProductId == id)?.CategoryId;
            var products = _context.Products.Where(e => e.CategoryId == categoryId).OrderBy(e => e.Date).Take(10).ToList();
            foreach (var product in products)
            {
                var wash = _context.Washings.FirstOrDefault(e => e.Id == product.WashingId);
                var categoryName = _context.Categories.FirstOrDefault(e => e.CategoryId == product.CategoryId)?.CategoryName;
                var productSizes = _context.ProductSizes.Where(e => e.ProductId == product.ProductId).Select(e => e.SizeId).ToList();

                List<Sizes> productSizesList = new List<Sizes>();
                foreach (var productSize in productSizes)
                {
                    var sizes = _context.Sizes.Where(e => e.SizeId == productSize).ToList();
                    foreach (var size in sizes)
                    {
                        productSizesList.Add(size);
                    }
                }

                //Return product images
                var productImagePathes = _context.Image.Where(e => e.ProductId == product.ProductId && e.ImgType == null).Select(e => e.ImgPath).ToList();
                List<byte[]> productImages = new List<byte[]>();
                List<string> types = new List<string>();
                foreach (var imagePath in productImagePathes)
                {
                    var image = File.ReadAllBytes(imagePath);
                    var type = GetFile(imagePath);
                    types.Add(type);
                    productImages.Add(image);
                }

                // Return size chart image
                var sizeImagePathes = _context.Image.FirstOrDefault(e => e.ProductId == product.ProductId && e.ImgType == "Size Image")?.ImgPath;
                byte[] sizeImage = null;
                string sizeImageType = null;
                if (sizeImagePathes != null)
                {
                    sizeImage = File.ReadAllBytes(sizeImagePathes);
                    sizeImageType = GetFile(sizeImagePathes);
                }
                ProductViewModel productModel = new ProductViewModel();
                productModel.ProductId = product.ProductId;
                productModel.ProductName = product.ProductName;
                productModel.ProductPrice = product.ProductPrice;
                productModel.CategoryId = product.CategoryId;
                productModel.Qty = product.Qty;
                productModel.Description = product.Description;
                productModel.Rate = product.Rate;
                productModel.ProductImageList = productImages;
                productModel.OfferPrice = product.OfferPrice;
                productModel.inOffer = product.InOffer;
                productModel.Types = types;
                productModel.type = sizeImageType;
                productModel.SizeChartImage = sizeImage;
                productModel.ProductWashingType = wash;
                productModel.WashingId = Convert.ToInt32(product.WashingId);
                productModel.WashingTitle = wash.Title;
                productModel.WashingDescription = wash.Description;
                productModel.ProductSizesList = productSizesList;
                productModel.SizeIdList = productSizesList.Select(e => e.SizeId).ToList();
                productModel.CategoryName = categoryName;
                productsList.Add(productModel);
            }
            return productsList;
        }
        private int SaveSizeImage(string file, string type)
        {
            var folderName = Path.Combine(_webHostEnvironment.WebRootPath, "Sizes_Images", DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString());
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            int imgId;
            var fileName = Path.Combine(pathToSave, Guid.NewGuid().ToString() + type);
            //var fullPath = Path.Combine(pathToSave, fileName);
            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }
            var bytes = Convert.FromBase64String(file);
            File.WriteAllBytes(fileName, bytes);
            string newFileName = "";

            using (MagickImage image = new MagickImage(fileName))
            {
                image.Format = image.Format;
                image.Resize(800, 800);
                image.Quality = 40;
                newFileName = Path.Combine(pathToSave, Guid.NewGuid() + type);
                image.Write(newFileName);
            }

            File.Delete(fileName);
            var newImage = new Image() { ImgPath = newFileName, ImgType = "Size Image", ProductId = null };
            _context.Image.Add(newImage);
            _context.SaveChanges();
            imgId = newImage.ImgId;
            return imgId;
        }
        private List<int> SaveBase64Images(List<string> files, List<string> type)
        {
            var folderName = Path.Combine(_webHostEnvironment.WebRootPath, "Products_Images", DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString());
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            List<int> imgId = new List<int>();

            //var fullPath = Path.Combine(pathToSave, fileName);
            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }
            for (int i = 0; i < files.Count; i++)
            {
                var fileName = Path.Combine(pathToSave, Guid.NewGuid().ToString() + type[i]);
                var bytes = Convert.FromBase64String(files[i]);
                File.WriteAllBytes(fileName, bytes);
                string newFileName = "";

                using (MagickImage image = new MagickImage(fileName))
                {
                    image.Format = image.Format;
                    image.Resize(800, 800);
                    image.Quality = 40;
                    newFileName = Path.Combine(pathToSave, Guid.NewGuid() + type[i]);
                    image.Write(newFileName);
                }

                File.Delete(fileName);
                var newImage = new Image() { ImgPath = newFileName, ProductId = null };
                _context.Image.Add(newImage);
                _context.SaveChanges();
                imgId.Add(newImage.ImgId);
            }



            return imgId;
        }

        public FileInfo GetExcelFile()
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            var users = _userManager.Users.ToList();
            ExcelPackage ExcelPkg = new ExcelPackage();
            ExcelWorksheet wsSheet1 = ExcelPkg.Workbook.Worksheets.Add("CustomerData");
            var counter = 1;
            wsSheet1.Column(1).Width = 40;
            wsSheet1.Column(2).Width = 25;
            wsSheet1.Column(3).Width = 60;

            wsSheet1.Cells[1, 1].Value = "Name";
            wsSheet1.Cells[1, 1].Style.Font.Size = 16;
            wsSheet1.Cells[1, 1].Style.Font.Bold = true;
            wsSheet1.Cells[1, 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
            //wsSheet1.Cells[1, 1].AutoFitColumns();

            wsSheet1.Cells[1, 2].Value = "PhoneNumber";
            wsSheet1.Cells[1, 2].Style.Font.Size = 16;
            wsSheet1.Cells[1, 2].Style.Font.Bold = true;
            wsSheet1.Cells[1, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
            //wsSheet1.Cells[1, 2].AutoFitColumns();

            wsSheet1.Cells[1, 3].Value = "Address";
            wsSheet1.Cells[1, 3].Style.Font.Size = 16;
            wsSheet1.Cells[1, 3].Style.Font.Bold = true;
            wsSheet1.Cells[1, 3].Style.Border.BorderAround(ExcelBorderStyle.Thin);
            //wsSheet1.Cells[1, 3].Style.w;

            foreach (var user in users)
            {
                wsSheet1.Cells[1 + counter, 1].Value = user?.FirstName ?? "" + " " + user?.LastName ?? "";
                wsSheet1.Cells[1 + counter, 2].Value = user?.PhoneNumber ?? "";
                wsSheet1.Cells[1 + counter, 3].Value = user?.Address ?? "";
                counter++;
            }

            wsSheet1.Protection.IsProtected = false;
            wsSheet1.Protection.AllowSelectLockedCells = false;
            var fileName = Guid.NewGuid() + "CustomerData.xls";
            ExcelPkg.SaveAs(new FileInfo(_webHostEnvironment.WebRootPath + "/" + fileName));
            var fileInfo = new FileInfo(_webHostEnvironment.WebRootPath + "/" + fileName);
            return fileInfo;
        }

        private static string GetFileExtension(string base64String)
        {
            var data = base64String.Substring(0, 5);

            switch (data.ToUpper())
            {
                case "IVBOR":
                    return ".png";
                case "/9J/4":
                    return ".jpg";
                case "AAAAF":
                    return ".mp4";
                case "JVBER":
                    return ".pdf";
                case "AAABA":
                    return ".ico";
                case "UMFYI":
                    return ".rar";
                case "E1XYD":
                    return ".rtf";
                case "U1PKC":
                    return ".txt";
                case "MQOWM":
                case "77U/M":
                    return ".srt";
                default:
                    return string.Empty;
            }
        }
    }


    public static class Filtration
    {
        public const int NoFilter = 1;
        public const int MostSelling = 2;
        public const int FromAToZ = 3;
        public const int FormZToA = 4;
        public const int FormHighPriceToLowPrice = 5;
        public const int FromLowPriceToHigherPrice = 6;
        public const int FromNewerToOlder = 7;
        public const int FromOlderToNewer = 8;

    }
}
