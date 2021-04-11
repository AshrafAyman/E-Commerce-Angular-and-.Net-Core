using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Repositories;
using WebApplication4.View_Model;

namespace WebApplication4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SizesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ISize _size;

        public SizesController(ApplicationDbContext context, ISize size)
        {
            _context = context;
            _size = size;
        }

        [HttpGet]
        public ActionResult GetSizes()
        {
            try
            {
                var sizes = _size.GetAllSizes();
                return Ok(sizes);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // GET: api/Countries/5
        [HttpGet("{id}")]
        public ActionResult GetSize(int id)
        {
            try
            {
                var size = _size.GetSizeById(id);
                return new JsonResult(size);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // PUT: api/Countries/5
        [HttpPut("{id}")]
        public IActionResult PutSize(int id, SizesViewModel size)
        {
            if (id != size.SizeId)
            {
                return new JsonResult(false);
            }
            try
            {
                _size.EditSize(size);
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // POST: api/Countries
        [HttpPost]
        public ActionResult PostSize(SizesViewModel size)
        {
            try
            {
                _size.AddSize(size);
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // DELETE: api/Countries/5
        [HttpDelete("{id}")]
        public ActionResult DeleteSize(int id)
        {
            try
            {
                _size.DeleteSize(id);
                return new JsonResult(true);
            }
            catch (Exception)
            {

                return new JsonResult(false);
            }
        }
    }
}
