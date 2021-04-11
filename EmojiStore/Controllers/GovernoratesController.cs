using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication4.Data;
using WebApplication4.Models;
using WebApplication4.Repositories;

namespace WebApplication4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GovernoratesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IGovernorate _governorate;

        public GovernoratesController(ApplicationDbContext context,IGovernorate governorate)
        {
            _context = context;
            _governorate=governorate;
        }

        // GET: api/Governorates
        [HttpGet]
        public ActionResult GetGovernorates()
        {
            try
            {
                var governorates= _governorate.GetAllCustomers();
                return Ok(governorates);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // GET: api/Governorates/5
        [HttpGet("{id}")]
        public ActionResult GetGovernorate(int id)
        {
            try
            {
            var governorate =  _governorate.GetGovernorateById(id);
                return new JsonResult(governorate);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // PUT: api/Governorates/5
        [HttpPut("{id}")]
        public IActionResult PutGovernorate(int id, Governorate governorate)
        {
            if (id != governorate.GovernorateId)
            {
                return BadRequest();
            }
            try
            {
                _governorate.EditGovernorate(governorate);
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // POST: api/Governorates
        [HttpPost]
        public ActionResult PostGovernorate(Governorate governorate)
        {
            try
            {
                _governorate.AddGovernorate(governorate);
                return new JsonResult(true); 
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // DELETE: api/Governorates/5
        [HttpDelete("{id}")]
        public ActionResult DeleteGovernorate(int id)
        {
            try
            {
                _governorate.DeleteGovernorate(id);
                return new JsonResult(true);
            }
            catch (Exception)
            {

                return new JsonResult(false);
            }
        }
    }
}
