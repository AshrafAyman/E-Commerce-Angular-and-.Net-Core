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
    public class AddressesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAddress _address;

        public AddressesController(ApplicationDbContext context,IAddress address)
        {
            _context = context;
            _address=address;
        }

        // GET: api/Addresses
        [HttpGet]
        public ActionResult<IEnumerable<Address>> GetAddresses()
        {
            try
            {
                var addresses= _address.GetAllAddresses();
                return Ok(addresses);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // GET: api/Addresses/5
        [HttpGet("{id}")]
        public ActionResult GetAddress(int id)
        {
            try
            {
            var address =  _address.GetAddressById(id);
                return new JsonResult(address);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            } 
        }

        // PUT: api/Addresses/5
        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAddress(int id, Address address)
        {
            if (id != address.AddressId)
            {
                return BadRequest();
            }
            try
            {
                _address.EditAddress(address);
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // POST: api/Addresses
        [HttpPost]
        public ActionResult PostAddress(Address address)
        {
            try
            {
                _address.AddAddress(address);
                return new JsonResult(true); 
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public ActionResult DeleteAddress(int id)
        {
            try
            {
                _address.DeleteAddress(id);
                return new JsonResult(true);
            }
            catch (Exception)
            {

                return new JsonResult(false);
            }
        }

    }
}
