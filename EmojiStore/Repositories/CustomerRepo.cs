using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Models;

namespace WebApplication4.Repositories
{
     public interface ICustomer
    {
        IEnumerable<Customer> GetAllCustomers();
        Customer GetCustomerById(int id);
        bool AddCustomer(Customer customer);
        bool EditCustomer(Customer customer);
        bool DeleteCustomer(int id);
        bool CustomerExists(int id);

    }
    public class CustomerRepo : ICustomer
    {
        ApplicationDbContext _context;
        public CustomerRepo(ApplicationDbContext context)
        {
            _context=context;
        }
        public bool AddCustomer(Customer customer)
        {
            _context.Customers.Add(customer);
            _context.SaveChanges();
            return true;
        }

        public bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.CustomerId == id);
        }

        public bool DeleteCustomer(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                 _context.Customers.Remove(customer);
                 _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool EditCustomer(Customer customer)
        {
            _context.Entry(customer).State = EntityState.Modified;
            _context.SaveChanges();
            return true;
        }

        public IEnumerable<Customer> GetAllCustomers()
        {
            return  _context.Customers.ToList();
        }

        public Customer GetCustomerById(int id)
        {
            return _context.Customers.FirstOrDefault(e => e.CustomerId == id);
        }
    }
}
