using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Models;
using WebApplication4.View_Model;

namespace WebApplication4.Repositories
{
    public interface IShipping
    {
        List<Shipping> GetAllShippings();
        ShippingViewModel GetShippingById(int id);
        bool AddShipping(ShippingViewModel model);
        bool EditShipping(ShippingViewModel model);
        bool DeleteShipping(int id);
    }
    public class ShippingRepo : IShipping
    {
        ApplicationDbContext _context;
        public ShippingRepo(ApplicationDbContext context)
        {
            _context = context;
        }
        public bool AddShipping(ShippingViewModel model)
        {
            Shipping shipping = new Shipping
            {
                Name = model.Name
            };
            _context.Shippings.Add(shipping);
            _context.SaveChanges();
            return true;
        }

        public bool DeleteShipping(int id)
        {
            var model = _context.Shippings.Find(id);
            if (model != null)
            {
                _context.Shippings.Remove(model);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool EditShipping(ShippingViewModel model)
        {
            var editedShipping = _context.Shippings.Find(model.Id);
            if (editedShipping != null)
            {
                editedShipping.Name = model.Name;
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public List<Shipping> GetAllShippings()
        {
            
            //return _context.Shippings.Skip(Math.Max(0, _context.Shippings.Count() - 1)).ToList();
            return _context.Shippings.ToList();
        }
         
        public ShippingViewModel GetShippingById(int id)
        {
            var model = _context.Shippings.FirstOrDefault(e => e.Id == id);
            ShippingViewModel size = new ShippingViewModel()
            {
                Id = model.Id,
                Name = model.Name
            };
            return size;
        }
    }
}
