using ImageMagick;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using WebApplication4.Data;
using WebApplication4.Models;
using WebApplication4.View_Model;
namespace WebApplication4.Repositories
{
    public interface ICaregory
    {
        IEnumerable<CategoryViewModel> GetAllCategories();
        IEnumerable<CategoryViewModel> GetCategoriesWithImagePath();
        IEnumerable<CategoryViewModel> GetAllCategoriesHeaders();
        CategoryViewModel GetCategoryById(int id);
        bool AddCategory(CategoryViewModel category);
        bool EditCategory(CategoryViewModel category);
        bool DeleteCategory(int id);
        bool CategoryExists(int id);
        int SaveImage(string file, string type);
    }
    public class CategoryRepo : ICaregory
    {
        ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public CategoryRepo(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }
        public bool AddCategory(CategoryViewModel category)
        {
            int imageId = 0;
            if (category.imageBase64.Contains("data:image/png;base64,"))
            {
                string toBeSearched = "data:image/png;base64,";
                string code = category.imageBase64.Substring(category.imageBase64.IndexOf(toBeSearched) + toBeSearched.Length);
                string type = GetFileExtension(code);
                imageId = this.SaveImage(code, type);
            }
            if (category.imageBase64.Contains("data:image/jpg;base64,"))
            {
                string toBeSearched = "data:image/jpg;base64,";
                string code = category.imageBase64.Substring(category.imageBase64.IndexOf(toBeSearched) + toBeSearched.Length);
                string type = GetFileExtension(code);
                imageId = this.SaveImage(code, type);
            }
            if (category.imageBase64.Contains("data:image/jpeg;base64,"))
            {
                string toBeSearched = "data:image/jpeg;base64,";
                string code = category.imageBase64.Substring(category.imageBase64.IndexOf(toBeSearched) + toBeSearched.Length);
                string type = GetFileExtension(code);
                imageId = this.SaveImage(code, type);
            }
            Category newCategory = new Category();
            newCategory.CategoryName = category.CategoryName;
            newCategory.ImgId = imageId;
            _context.Categories.Add(newCategory);
            _context.SaveChanges();
            var image = _context.Image.FirstOrDefault(e => e.ImgId == imageId);
            if (image != null)
            {
                image.CategoryId = newCategory.CategoryId;
                _context.SaveChanges();
            }
            return true;
        }

        public bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.CategoryId == id);
        }

        public bool DeleteCategory(int id)
        {
            var category = _context.Categories.Find(id);
            if (category != null)
            {
                var img = _context.Image.FirstOrDefault(a => a.CategoryId == category.CategoryId);
                File.Delete(img.ImgPath);
                _context.Image.Remove(img);
                _context.SaveChanges();

                _context.Categories.Remove(category);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool EditCategory(CategoryViewModel category)
        {
            if (category.imageBase64 != null)
            {
                var img = _context.Image.FirstOrDefault(a => a.CategoryId == category.CategoryId);
                if (img != null)
                {
                    File.Delete(img.ImgPath);
                    _context.Image.Remove(img);
                    _context.SaveChanges();
                }
            }
            int imageId = 0;
            if (category.imageBase64.Contains("data:image/png;base64,"))
            {
                string toBeSearched = "data:image/png;base64,";
                string code = category.imageBase64.Substring(category.imageBase64.IndexOf(toBeSearched) + toBeSearched.Length);
                string type = GetFileExtension(code);
                imageId = this.SaveImage(code, type);
            }
            if (category.imageBase64.Contains("data:image/jpg;base64,"))
            {
                string toBeSearched = "data:image/jpg;base64,";
                string code = category.imageBase64.Substring(category.imageBase64.IndexOf(toBeSearched) + toBeSearched.Length);
                string type = GetFileExtension(code);
                imageId = this.SaveImage(code, type);
            }
            if (category.imageBase64.Contains("data:image/jpeg;base64,"))
            {
                string toBeSearched = "data:image/jpeg;base64,";
                string code = category.imageBase64.Substring(category.imageBase64.IndexOf(toBeSearched) + toBeSearched.Length);
                string type = GetFileExtension(code);
                imageId = this.SaveImage(code, type);
            }

            var editedCategory = _context.Categories.FirstOrDefault(e => e.CategoryId == category.CategoryId);
            if (editedCategory != null)
            {
                editedCategory.CategoryId = category.CategoryId;
                editedCategory.CategoryName = category.CategoryName;
                editedCategory.ImgId = imageId;
                _context.SaveChanges();
                var image = _context.Image.FirstOrDefault(e => e.ImgId == imageId);
                if (image != null)
                {
                    image.CategoryId = editedCategory.CategoryId;
                    _context.SaveChanges();
                }
            }
            return true;
        }

        public IEnumerable<CategoryViewModel> GetAllCategories()
        {
            var categories = _context.Categories.ToList();
            List<CategoryViewModel> categoriesList = new List<CategoryViewModel>();
            foreach (var category in categories)
            {
                var categoryImagePathes = _context.Image.FirstOrDefault(e => e.CategoryId == category.CategoryId)?.ImgPath;
                byte[] categoryImage = null;
                string categoryImageType = null;
                if (categoryImagePathes != null)
                {
                    categoryImage = File.ReadAllBytes(categoryImagePathes);
                    categoryImageType = GetFile(categoryImagePathes);
                }
                CategoryViewModel model = new CategoryViewModel();
                model.CategoryId = category.CategoryId;
                model.CategoryName = category.CategoryName;
                model.Image = categoryImage;
                model.type = categoryImageType;
                categoriesList.Add(model);
            }
            return categoriesList;
        }
        public IEnumerable<CategoryViewModel> GetCategoriesWithImagePath()
        {
            var categories = _context.Categories.ToList();
            List<CategoryViewModel> categoriesList = new List<CategoryViewModel>();
            foreach (var category in categories)
            {
                var categoryImagePath = _context.Image.FirstOrDefault(e => e.CategoryId == category.CategoryId)?.ImgPath;
                //byte[] categoryImage = null;
                //string categoryImageType = null;
                if (categoryImagePath != null)
                {
                    //categoryImage = File.ReadAllBytes(categoryImagePathes);
                    //categoryImageType = GetFile(categoryImagePathes);
                }
                CategoryViewModel model = new CategoryViewModel();
                model.CategoryId = category.CategoryId;
                model.CategoryName = category.CategoryName;
                model.ImagePath = "https://www.emoji-store.com/" + categoryImagePath?.Substring(categoryImagePath.IndexOf("Category_Images", StringComparison.Ordinal));
                //var path =
                //@"h:\root\home\mohamedshata-002\www\Emoji\wwwroot\Category_Images\2021\2\0a978252-0cf4-45da-89ca-d5921848ec81.jpg";
                //var output= path.;
                //model.Image = categoryImage;
                //model.type = categoryImageType;
                categoriesList.Add(model);
            }
            return categoriesList;
        }

        public IEnumerable<CategoryViewModel> GetAllCategoriesHeaders()
        {
            var categories = _context.Categories.ToList();
            List<CategoryViewModel> categoriesList = new List<CategoryViewModel>();
            foreach (var category in categories)
            {
                CategoryViewModel model = new CategoryViewModel();
                model.CategoryId = category.CategoryId;
                model.CategoryName = category.CategoryName;
                categoriesList.Add(model);
            }
            return categoriesList;
        }


        public CategoryViewModel GetCategoryById(int id)
        {
            var category = _context.Categories.FirstOrDefault(e => e.CategoryId == id);
            var categoryImagePathes = _context.Image.FirstOrDefault(e => e.CategoryId == category.CategoryId)?.ImgPath;
            byte[] categoryImage = null;
            string categoryImageType = null;
            if (categoryImagePathes != null)
            {
                categoryImage = File.ReadAllBytes(categoryImagePathes);
                categoryImageType = GetFile(categoryImagePathes);
            }
            CategoryViewModel model = new CategoryViewModel
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName,
                type = categoryImageType,
                Image = categoryImage
            };
            return model;
        }

        public int SaveImage(string file, string type)
        {
            var folderName = Path.Combine(_webHostEnvironment.WebRootPath, "Category_Images", DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString());
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
            var newImage = new Image() { ImgPath = newFileName, CategoryId = null };
            _context.Image.Add(newImage);
            _context.SaveChanges();
            imgId = newImage.ImgId;
            return imgId;
        }

        private static string GetFile(string path)
        {
            string contentType;
            new FileExtensionContentTypeProvider().TryGetContentType(path, out contentType);
            return contentType ?? "application/octet-stream";
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
}
