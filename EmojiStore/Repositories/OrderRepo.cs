using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Models;
using WebApplication4.ViewModel;
namespace WebApplication4.Repositories
{
    public interface IOrder
    {
        IEnumerable<OrderViewModel> GetAllOrders(string customerId);
        Order GetOrderById(int id);
        bool AddOrder(OrderViewModel oderData);
        bool EditOrder(OrderViewModel orderData);
        bool DeleteOrder(int id);
        bool OrderExists(int id);

        Task<List<OrderViewModel>> GetAllOrders(int status);
        bool ChangeOrderStatus(int id, int status);
        IEnumerable<OrderViewModel> GetUserOrders(string customerId);
        bool RejectOrder(int id, int status, string reason);
    }
    public class OrderRepo : IOrder
    {
        ApplicationDbContext _context;
        private UserManager<ApplicationUser> _userManager;
        public OrderRepo(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
        }
        public bool AddOrder(OrderViewModel orderData)
        {
            var newOrderNo = _context.Orders.Max(e => e.OrderNo);
            newOrderNo = newOrderNo == null ? 1 : newOrderNo + 1;
            var order = new Order()
            {
                CustomerId = orderData.CustomerId,
                OrderNo = newOrderNo,
                OrderDate = orderData.OrderDate,
                OrderState = orderData.OrderState,
                OrderStateDate = orderData.OrderStateDate,
                OrderTotal = orderData.OrderTotal,
                OrderTotalNet = orderData.OrderTotalNet,
                OrderCount = orderData.OrderCount,
                CustomerName=orderData.CustomerName,
                PhoneNumber=orderData.Phone,
                Address=orderData.Address
            };
            _context.Orders.Add(order);
            _context.SaveChanges();

            var details = orderData.OrderDetails;
            foreach (var detail in details)
            {
                var newOrderDetail = new OrderDetails();
                newOrderDetail.OrderId = order.OrderId;
                newOrderDetail.Price = detail.Price;
                //newOrderDetail.Product=detail.Product;
                newOrderDetail.Qty = detail.Qty;
                newOrderDetail.Total = detail.Total;
                newOrderDetail.TotalNet = detail.TotalNet;
                newOrderDetail.ProductId = detail.ProductId;
                newOrderDetail.Size = detail.Size;
                _context.OrderDetails.Add(newOrderDetail);
                _context.SaveChanges();
            }
            return true;
        }

        public bool DeleteOrder(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                order.IsDelete = true;
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool EditOrder(OrderViewModel orderData)
        {
            var order = _context.Orders.FirstOrDefault(e => e.OrderId == orderData.OrderId);
            if (order != null)
            {
                order.OrderNo = orderData.OrderNo;
                order.OrderState = orderData.OrderState;
                order.OrderStateDate = orderData.OrderStateDate;
                order.OrderTotal = orderData.OrderTotal;
                order.OrderTotalNet = orderData.OrderTotalNet;
                order.OrderDate = orderData.OrderDate;
                order.OrderCount = orderData.OrderCount;
                _context.SaveChanges();
            }
            var orderDetail = _context.OrderDetails.Where(e => e.OrderId == orderData.OrderId).ToList();
            foreach (var details in orderDetail)
            {
                _context.OrderDetails.Remove(details);
                _context.SaveChanges();
            }

            foreach (var detail in orderDetail)
            {
                var newOrderDetail = new OrderDetails();
                newOrderDetail.OrderId = order.OrderId;
                newOrderDetail.Price = detail.Price;
                newOrderDetail.Product = detail.Product;
                newOrderDetail.Qty = detail.Qty;
                newOrderDetail.Total = detail.Total;
                newOrderDetail.TotalNet = detail.TotalNet;
                newOrderDetail.ProductId = detail.ProductId;
                _context.OrderDetails.Add(newOrderDetail);
                _context.SaveChanges();
            }
            return true;
        }

        public IEnumerable<OrderViewModel> GetAllOrders(string customerId)
        {
            var ordersList = new List<OrderViewModel>();
            var customerOrders = _context.Orders.Where(e => e.CustomerId == customerId).ToList();
            
            foreach (var order in customerOrders)
            {
                var newOrder = new OrderViewModel();
                newOrder.CustomerId = order.CustomerId;
                newOrder.OrderId = order.OrderId;
                newOrder.OrderNo = order.OrderNo;
                newOrder.OrderState = order.OrderState;
                newOrder.OrderStateDate = order.OrderStateDate;
                newOrder.OrderTotal = order.OrderTotal;
                newOrder.OrderTotalNet = order.OrderTotalNet;
                newOrder.OrderDate = order.OrderDate;
                newOrder.OrderCount = order.OrderCount;
                newOrder.OrderDate = order.OrderDate;

                var detailList = new List<OrderDetailViewModel>();
                var details = _context.OrderDetails.Where(e => e.OrderId == order.OrderId).ToList();
                foreach (var detail in details)
                {
                    
                    var newDetail = new OrderDetailViewModel();
                    newDetail.OrderId = detail.OrderId;
                    newDetail.OrderDetailId = detail.OrderDetailId;
                    newDetail.Price = detail.Price;
                    newDetail.Qty = detail.Qty;
                    newDetail.Total = detail.Total;
                    newDetail.TotalNet = detail.TotalNet;
                    newDetail.ProductId = detail.ProductId;
                    detailList.Add(newDetail);
                }
                newOrder.OrderDetails = detailList;
                ordersList.Add(newOrder);
            }

            return ordersList;
        }


        public IEnumerable<OrderViewModel> GetUserOrders(string customerId)
        {
            var ordersList = new List<OrderViewModel>();
            var customerOrders = _context.Orders.Where(e => e.CustomerId == customerId).ToList();
            foreach (var order in customerOrders)
            {
                var newOrder = new OrderViewModel();
                newOrder.CustomerId = order.CustomerId;
                newOrder.OrderId = order.OrderId;
                newOrder.OrderNo = order.OrderNo;
                newOrder.OrderState = order.OrderState;
                newOrder.OrderStateDate = order.OrderStateDate;
                newOrder.OrderTotal = order.OrderTotal;
                newOrder.OrderTotalNet = order.OrderTotalNet;
                newOrder.OrderDate = order.OrderDate;
                newOrder.OrderCount = order.OrderCount;
                newOrder.RejectionReason = order.RejectionReason;
                newOrder.OrderDate = order.OrderDate;
                newOrder.ShortDate = order.OrderDate?.ToString("d");
                newOrder.OrderStatus = GetOrderStatus(order.OrderState ?? 1);
                var detailList = new List<OrderDetailViewModel>();
                var details = _context.OrderDetails.Where(e => e.OrderId == order.OrderId).ToList();
                foreach (var detail in details)
                {
                    var productName = _context.Products.FirstOrDefault(e => e.ProductId == detail.ProductId)
                        ?.ProductName;
                    var newDetail = new OrderDetailViewModel();
                    newDetail.OrderId = detail.OrderId;
                    newDetail.OrderDetailId = detail.OrderDetailId;
                    newDetail.Price = detail.Price;
                    newDetail.Qty = detail.Qty;
                    newDetail.Total = detail.Total;
                    newDetail.ProductName = productName;
                    newDetail.TotalNet = detail.TotalNet;
                    newDetail.ProductId = detail.ProductId;
                    detailList.Add(newDetail);
                }
                newOrder.OrderDetails = detailList;
                ordersList.Add(newOrder);
            }

            return ordersList;
        }


        public string GetOrderStatus(int state)
        {
            if (state == 1)
            {
                return "Waiting";
            }
            else if (state == 2)
            {
                return "Accepted";

            }
            else if (state == 3)
            {
                return "Rejected";

            }
            else if (state == 4)
            {
                return "Delivered";
            }
            else
            {
                return "Canceled";
            }

        }

        public Order GetOrderById(int id)
        {
            var order = _context.Orders.FirstOrDefault(e => e.OrderId == id);
            return order;
        }

        public bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.OrderId == id);
        }
        public async Task<List<OrderViewModel>> GetAllOrders(int status)
        {
            var orders = _context.Orders.Where(e => e.OrderState == status).ToList();
            List<OrderViewModel> ordersList = new List<OrderViewModel>();
            foreach (var order in orders)
            {
                var orderDetailsList = new List<OrderDetailViewModel>();
                var userData = await _userManager.FindByIdAsync(order.CustomerId);
                var orderDetails = _context.OrderDetails.Where(e => e.OrderId == order.OrderId).ToList();
                foreach (var orderDetail in orderDetails)
                {
                    var productName = _context.Products.FirstOrDefault(e => e.ProductId == orderDetail.ProductId)?.ProductName;
                    var productOrderImage = _context.Image.FirstOrDefault(e => e.ProductId == orderDetail.ProductId && e.ImgType != "Size Image")?.ImgPath;
                    var orderDetailModel = new OrderDetailViewModel
                    {
                        OrderDetailId = orderDetail.OrderDetailId,
                        OrderId = orderDetail.OrderId,
                        ProductId = orderDetail.ProductId,
                        ProductName = productName,
                        Price = orderDetail.Price,
                        Qty = orderDetail.Qty,
                        Total = orderDetail.Total,
                        TotalNet = orderDetail.TotalNet,
                        Size=orderDetail.Size,
                        //ImagePath = "https://localhost:44399/" + productOrderImage?.Substring(productOrderImage.IndexOf("Products_Images", StringComparison.Ordinal)),
                        ImagePath= "https://www.emoji-store.com/" + productOrderImage?.Substring(productOrderImage.IndexOf("Products_Images", StringComparison.Ordinal)),
                };
                    orderDetailsList.Add(orderDetailModel);
                }
                var orderModel = new OrderViewModel
                {
                    OrderId = order.OrderId,
                    OrderNo = order.OrderNo,
                    ShortDate = order.OrderDate?.ToString("d"),
                    OrderCount = order.OrderCount,
                    OrderState = order.OrderState,
                    OrderStateDate = order.OrderStateDate,
                    OrderTotal = order.OrderTotal,
                    OrderTotalNet = order.OrderTotalNet,
                    CustomerName = userData==null?order.CustomerName:userData.FirstName + " " + userData.LastName,
                    Address = userData == null ? order.Address : userData.Address,
                    Phone = userData == null ? order.PhoneNumber : userData.PhoneNumber,
                    OrderDetails = orderDetailsList
                };
                ordersList.Add(orderModel);
            }
            var list= ordersList.OrderByDescending(e => e.OrderNo).ToList();
            return list;
        }
        public bool ChangeOrderStatus(int id, int status)
        {
            var order = _context.Orders.FirstOrDefault(e => e.OrderId == id);
            if (order != null)
            {
                order.OrderState = status;
                _context.SaveChanges();
                return true;
            }
            return false;
        }
        public bool RejectOrder(int id, int status, string reason)
        {
            var order = _context.Orders.FirstOrDefault(e => e.OrderId == id);
            if (order != null)
            {
                order.OrderState = status;
                order.RejectionReason = reason;
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
