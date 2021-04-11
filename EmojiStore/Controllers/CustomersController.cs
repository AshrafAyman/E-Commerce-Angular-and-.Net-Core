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
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICustomer _customer;

        public CustomersController(ApplicationDbContext context,ICustomer customer)
        {
            _context = context;
            _customer=customer;
        }

        // GET: api/Customers
        [HttpGet]
        public ActionResult GetCustomers()
        {
            try
            {
                var customers= _customer.GetAllCustomers();
                return Ok(customers);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public ActionResult GetCustomer(int id)
        {
           try
            {
            var customer =  _customer.GetCustomerById(id);
                return new JsonResult(customer);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // PUT: api/Customers/5
        [HttpPut("{id}")]
        public IActionResult PutCustomer(int id, Customer customer)
        {
            if (id != customer.CustomerId)
            {
                return BadRequest();
            }
           try
            {
                _customer.EditCustomer(customer);
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // POST: api/Customers
        [HttpPost]
        public ActionResult PostCustomer(Customer customer)
        {
           try
            {
                _customer.AddCustomer(customer);
                return new JsonResult(true); 
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public ActionResult DeleteCustomer(int id)
        {
            try
            {
                _customer.DeleteCustomer(id);
                return new JsonResult(true);
            }
            catch (Exception)
            {

                return new JsonResult(false);
            }
        }
    }
}
