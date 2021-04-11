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
    public class CountriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICountry _country;

        public CountriesController(ApplicationDbContext context,ICountry country)
        {
            _context = context;
            _country=country;
        }

        // GET: api/Countries
        [HttpGet]
        public ActionResult GetCountries()
        {
            try
            {
                var countries= _country.GetAllCountries();
                return Ok(countries);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // GET: api/Countries/5
        [HttpGet("{id}")]
        public ActionResult GetCountry(int id)
        {
           try
            {
            var country =  _country.GetCountryById(id);
                return new JsonResult(country);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // PUT: api/Countries/5
        [HttpPut("{id}")]
        public IActionResult PutCountry(int id, Country country)
        {
            if (id != country.CountryId)
            {
                return BadRequest();
            }
            try
            {
                _country.EditCountry(country);
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // POST: api/Countries
        [HttpPost]
        public ActionResult PostCountry(Country country)
        {
           try
            {
                _country.AddCountry(country);
                return new JsonResult(true); 
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // DELETE: api/Countries/5
        [HttpDelete("{id}")]
        public ActionResult DeleteCountry(int id)
        {
           try
            {
                _country.DeleteCountry(id);
                return new JsonResult(true);
            }
            catch (Exception)
            {

                return new JsonResult(false);
            }
        }
    }
}
