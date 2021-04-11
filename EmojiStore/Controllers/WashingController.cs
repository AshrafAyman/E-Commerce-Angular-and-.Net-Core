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
    public class WashingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWash _wash;

        public WashingController(ApplicationDbContext context, IWash wash)
        {
            _context = context;
            _wash = wash;
        }

        [HttpGet]
        public ActionResult GetAllWashingTypes()
        {
            try
            {
                var washingTypes = _wash.GetAllWashingTypes();
                return Ok(washingTypes);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // GET: api/Countries/5
        [HttpGet("{id}")]
        public ActionResult GetWashingType(int id)
        {
            try
            {
                var washingType = _wash.GetWashTypeById(id);
                return new JsonResult(washingType);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // PUT: api/Countries/5
        [HttpPut("{id}")]
        public IActionResult EditWashingType(int id, WashingViewModel model)
        {
            if (id != model.Id)
            {
                return new JsonResult(false);
            }
            try
            {
                _wash.EditWashngType(model);
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // POST: api/Countries
        [HttpPost]
        public ActionResult PostWashingType(WashingViewModel model)
        {
            try
            {
                _wash.AddWashngType(model);
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // DELETE: api/Countries/5
        [HttpDelete("{id}")]
        public ActionResult DeleteWashingType(int id)
        {
            try
            {
                _wash.DeleteWashngType(id);
                return new JsonResult(true);
            }
            catch (Exception)
            {

                return new JsonResult(false);
            }
        }
    }
}
