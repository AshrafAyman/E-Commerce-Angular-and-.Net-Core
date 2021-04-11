using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Repositories;
using WebApplication4.View_Model;

namespace WebApplication4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private ICart _cart;
        public CartController(ICart cart)
        {
            _cart = cart;
        }
        [HttpPost("AddToCart")]
        public IActionResult AddToCart(List<CartViewModel> model)
        {
            try
            {
                var result = _cart.AddToCart(model);
                if (result == true)
                {
                    return new JsonResult(true);
                }
                else
                {
                    return new JsonResult(false);
                }
            }
            catch (Exception e)
            {
                return new JsonResult(e.Message);
            }
            

        }
    }
}
