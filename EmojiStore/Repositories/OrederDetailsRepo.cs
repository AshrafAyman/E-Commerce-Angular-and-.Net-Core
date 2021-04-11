using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Models;

namespace WebApplication4.Repositories
{
    public interface IOrederDetails
    {
        IEnumerable<OrderDetails> GetAllOrderDetails();
        IEnumerable<OrderDetails> GetOrderDetailById(int id);
        bool AddOrderDetail(OrderDetails[] orderDetails);
        bool EditOrderDetail(OrderDetails orderDetails);
        bool DeleteOrderDetail(int id);
        bool OrderDetailExists(int id);

    }
    public class OrederDetailsRepo : IOrederDetails
    {
        ApplicationDbContext _context;
        public OrederDetailsRepo(ApplicationDbContext context)
        {
            _context=context;
        }
        public bool AddOrderDetail(OrderDetails[] orderDetails)
        {
            foreach (var orderDetail in orderDetails)
            {
             _context.OrderDetails.Add(orderDetail);

            }
            _context.SaveChanges();
            return true;
        }

        public bool DeleteOrderDetail(int id)
        {
            var orderDetail = _context.OrderDetails.Find(id);
            if (orderDetail != null)
            {
                 _context.OrderDetails.Remove(orderDetail);
                 _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool EditOrderDetail(OrderDetails orderDetails)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<OrderDetails> GetAllOrderDetails()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<OrderDetails> GetOrderDetailById(int id)
        {
            throw new NotImplementedException();
        }

        public bool OrderDetailExists(int id)
        {
            throw new NotImplementedException();
        }
    }
}
