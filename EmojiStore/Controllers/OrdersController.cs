using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Repositories;
using WebApplication4.View_Model;
using WebApplication4.ViewModel;
namespace WebApplication4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IOrder _order;

        public OrdersController(ApplicationDbContext context, IOrder order)
        {
            _context = context;
            _order = order;
        }

        // GET: api/Orders
        [HttpGet]
        public ActionResult GetOrders(string customerId)
        {
            try
            {
                var orders = _order.GetAllOrders(customerId);
                return Ok(orders);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public ActionResult GetOrder(int id)
        {
            try
            {
                var order = _order.GetOrderById(id);
                return new JsonResult(order);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public IActionResult PutOrder(int id, OrderViewModel order)
        {
            if (id != order.OrderId)
            {
                return BadRequest();
            }
            try
            {
                _order.EditOrder(order);
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // POST: api/Orders
        [HttpPost("PostCheckoutOrder")]
        public ActionResult PostCheckoutOrder(OrderViewModel order)
        {
            try
            {
                _order.AddOrder(order);
                return new JsonResult(true);
            }
            catch (Exception e)
            {
                return new JsonResult(false);
            }
        }

        [HttpGet("GetUserOrders")]
        public ActionResult GetUserOrders(string id)
        {
            try
            {
                var order = _order.GetUserOrders(id);
                return new JsonResult(order);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }
        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public ActionResult DeleteOrder(int id)
        {
            try
            {
                _order.DeleteOrder(id);
                return new JsonResult(true);
            }
            catch (Exception)
            {

                return new JsonResult(false);
            }
        }

        [HttpGet("GetWaitingOrders")]
        public async Task<ActionResult> GetWaitingOrders()
        {
            try
            {
                var result = await _order.GetAllOrders(1);
                return new JsonResult(result);
            }
            catch (Exception e)
            {

                return new JsonResult(e.Message);
            }
            
        }
        [HttpGet("GetAcceptedOrders")]
        public async Task<ActionResult> GetAcceptedOrders()
        {
            var result =await _order.GetAllOrders(2);
            return new JsonResult(result);
        }
        [HttpGet("GetRejectedOrders")]
        public async Task<ActionResult> GetRejectedOrders()
        {
            var result = await _order.GetAllOrders(3);
            return new JsonResult(result);
        }
        [HttpGet("AcceptOrders/{id}")]
        public ActionResult AcceptOrders(int id)
        {
            var result = _order.ChangeOrderStatus(id,2);
            if (result != null)
            {
                return new JsonResult(result);
            }
            return new JsonResult(false);
        }
        [HttpPost("RejectOrders")]
        public ActionResult RejectOrders(RejectionViewModel model)
        {
            var result = _order.RejectOrder(model.Id, 3,model.Reason);
            if (result == true)
            {
                return new JsonResult(true);
            }
            return new JsonResult(false);
        }
    }
}
