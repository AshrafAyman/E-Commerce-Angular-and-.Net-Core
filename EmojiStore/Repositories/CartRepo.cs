using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Models;
using WebApplication4.View_Model;

namespace WebApplication4.Repositories
{
    public interface ICart
    {
        bool AddToCart(List<CartViewModel> model);
    }
    public class CartRepo : ICart
    {
        private ApplicationDbContext _context;
        public CartRepo(ApplicationDbContext context)
        {
            _context = context;
        }
        public bool AddToCart(List<CartViewModel> model)
        {
            if (model != null)
            {
                foreach (var cart in model)
                {
                    Cart newCart = new Cart
                    {
                        ProductId=cart.ProductId,
                        ProductName=cart.ProductName,
                        ProductPrice=cart.ProductPrice,
                        Quantity=cart.Quantity,
                        Total=cart.Total,
                        UserId=cart.UserId,
                        IsCheckedOut=true
                    };
                    _context.Carts.Add(newCart);
                    _context.SaveChanges();
                }
                return true;
            }
            return false;
        }
    }
}
