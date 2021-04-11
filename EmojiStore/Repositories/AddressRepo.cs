using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Models;

namespace WebApplication4.Repositories
{
     public interface IAddress
    {
        IEnumerable<Address> GetAllAddresses();
        Address GetAddressById(int id);
        bool AddAddress(Address address);
        bool EditAddress(Address address);
        bool DeleteAddress(int id);
        bool AddressExists(int id);

    }
    public class AddressRepo : IAddress
    {
        ApplicationDbContext _context;
        public AddressRepo(ApplicationDbContext context)
        {
            _context=context;
        }

        public bool AddAddress(Address address)
        {
            _context.Addresses.Add(address);
            _context.SaveChanges();
            return true;
        }
        
        public bool AddressExists(int id)
        {
            return _context.Addresses.Any(e => e.AddressId == id);
        }

        public bool DeleteAddress(int id)
        {
            var address = _context.Addresses.Find(id);
            if (address != null)
            {
                 _context.Addresses.Remove(address);
                 _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool EditAddress(Address address)
        {
            _context.Entry(address).State = EntityState.Modified;
            _context.SaveChanges();
            return true;
        }

        public Address GetAddressById(int id)
        {
            return _context.Addresses.FirstOrDefault(e => e.AddressId == id);
        }

        public IEnumerable<Address> GetAllAddresses()
        {
            return  _context.Addresses.ToList();
        }
    }
}
