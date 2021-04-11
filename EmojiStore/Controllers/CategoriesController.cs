using Microsoft.AspNetCore.Mvc;
using System;
using WebApplication4.Data;
using WebApplication4.Repositories;
using WebApplication4.View_Model;

namespace WebApplication4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        ICaregory _category;
        public CategoriesController(ApplicationDbContext context, ICaregory caregory)
        {
            _context = context;
            _category = caregory;
        }

        // GET: api/Categories
        [HttpGet]
        public ActionResult GetCategories()
        {
            try
            {
                var categories = _category.GetAllCategories();
                return Ok(categories);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }

        [HttpGet("GetCategoriesHeaders")]
        public ActionResult GetCategoriesHeaders()
        {
            try
            {
                var categories = _category.GetAllCategoriesHeaders();
                return Ok(categories);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }
        // GET: api/Categories/5
        [HttpGet("{id}")]
        public ActionResult GetCategory(int id)
        {
            try
            {
                var category = _category.GetCategoryById(id);
                return new JsonResult(category);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // PUT: api/Categories/5
        [HttpPut("{id}")]
        public IActionResult PutCategory(int id, CategoryViewModel category)
        {
            if (id != category.CategoryId)
            {
                return BadRequest();
            }
            try
            {
                _category.EditCategory(category);
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // POST: api/Categories
        [HttpPost]
        public ActionResult PostCategory(CategoryViewModel category)
        {
            try
            {
                _category.AddCategory(category);
                return new JsonResult(true);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public ActionResult DeleteCategory(int id)
        {
            try
            {
                _category.DeleteCategory(id);
                return new JsonResult(true);
            }
            catch (Exception)
            {

                return new JsonResult(false);
            }
        }

        [HttpGet("GetCategoriesWithImagePath")]
        public ActionResult GetCategoriesWithImagePath()
        {
            try
            {
                var categories = _category.GetCategoriesWithImagePath();
                return Ok(categories);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }

        //[HttpPost("PostImage")]
        //public ActionResult PostImage(string files)
        //{
        //    //var files = Request.Form.Files;
        //    var list = _category.SaveImage(files);
        //    return new JsonResult(list);
        //}

    }
}
