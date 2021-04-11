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
    public class ShippingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IShipping _shipping;

        public ShippingController(ApplicationDbContext context, IShipping shipping)
        {
            _context = context;
            _shipping = shipping;
        }

        [HttpGet]
        public ActionResult GetShipping()
        {
            try
            {
                var sizes = _shipping.GetAllShippings();
                return Ok(sizes);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // GET: api/Countries/5
        [HttpGet("{id}")]
        public ActionResult GetShippings(int id)
        {
            try
            {
                var size = _shipping.GetShippingById(id);
                return new JsonResult(size);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // PUT: api/Countries/5
        [HttpPut("{id}")]
        public IActionResult PutShipping(int id, ShippingViewModel model)
        {
            if (id != model.Id)
            {
                return new JsonResult(false);
            }
            try
            {
                _shipping.EditShipping(model);
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // POST: api/Countries
        [HttpPost]
        public ActionResult PostShipping(ShippingViewModel model)
        {
            try
            {
                _shipping.AddShipping(model);
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
                _shipping.DeleteShipping(id);
                return new JsonResult(true);
            }
            catch (Exception)
            {

                return new JsonResult(false);
            }
        }
    }
}
