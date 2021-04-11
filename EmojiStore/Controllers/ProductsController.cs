using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using WebApplication4.Data;
using WebApplication4.Repositories;
using WebApplication4.View_Model;
namespace WebApplication4.Controllers
{
    //[ApiExplorerSettings(IgnoreApi = true)]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        IProduct _product;
        public ProductsController(ApplicationDbContext context, IProduct product)
        {
            _context = context;
            _product = product;
        }

        [HttpGet("GetOffer")]
        public ActionResult GetOffer()
        {
            try
            {
                var offeredProduct = _product.GetOffer();
                return Ok(offeredProduct);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }

        [HttpPost("CreateOffer")]
        public ActionResult SetOffer(OfferViewModel model)
        {
            try
            {
                var offeredProduct = _product.SetOffer(model);
                return new JsonResult(true);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }

        [HttpDelete("RemoveOffer/{id}")]
        public ActionResult RemoveOffer(int id)
        {
            try
            {
                var offeredProduct = _product.RemoveOffer(id);
                return new JsonResult(true);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }

        [HttpGet("BestProducts")]
        public ActionResult GetBestProducts()
        {
            try
            {
                var products = _product.BestReviewedProducts();
                return Ok(products);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }

        [HttpGet("NewProducts")]
        public ActionResult GetNewProducts()
        {
            try
            {
                var products = _product.NewProducts();
                return Ok(products);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }

        // GET: api/Products
        [HttpGet]
        public ActionResult GetProducts()
        {
            try
            {
                var products = _product.GetAllProducts();
                return Ok(products);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }

        [HttpPost("GetProductsByFilter")]
        public ActionResult GetProductsByFilter(GetProductViewModel model)
        {
            try
            {
                var products = _product.GetProductsByFilter(model);
                var result = new ProductCategoryViewModel();
                result.ProductList = products.Skip(16 * (model.Page - 1)).Take(16).ToList();
                result.Count = products.Count;
                return Ok(result);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }

        [HttpGet("GetCustomerData")]
        public ActionResult GetCustomerData()
        {
            try
            {
                var fileInfo = _product.GetExcelFile();
                var bytes = System.IO.File.ReadAllBytes(fileInfo.FullName);
                const string contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                HttpContext.Response.ContentType = contentType;
                HttpContext.Response.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition");

                var fileContentResult = new FileContentResult(bytes, contentType)
                {
                    FileDownloadName = fileInfo.Name
                };

                return fileContentResult;
            }
            catch (Exception e)
            {
                return new JsonResult("e.Message = " + e.Message + ", e.InnerException = " + e.InnerException?.Message);
            }
        }

        [HttpGet("GetSuggestedProducts/{id}")]
        public ActionResult GetSuggestedProducts(int id)
        {
            try
            {
                var products = _product.GetSuggestedProducts(id);
                return Ok(products);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }


        // GET: api/Products/5
        [HttpGet("{id}")]
        public ActionResult GetProduct(int id)
        {
            try
            {
                var product = _product.GetProductById(id);
                return new JsonResult(product);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        public IActionResult PutProduct(int id, ProductViewModel product)
        {
            if (id != product.ProductId)
            {
                return new JsonResult("Product Id not valid");
            }
            try
            {
                _product.EditProduct(product);

                return new JsonResult(true);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }



        // POST: api/Products

        [HttpPost("PostProduct")]
        public ActionResult PostProduct([FromBody] ProductViewModel product)
        {
            try
            {
                _product.AddProduct(product);
                return new JsonResult(true);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }


        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public ActionResult DeleteProduct(int id)
        {
            try
            {
                _product.DeleteProduct(id);
                return new JsonResult(true);
            }
            catch (Exception e)
            {

                return new JsonResult(false);
            }
        }
    }
}
