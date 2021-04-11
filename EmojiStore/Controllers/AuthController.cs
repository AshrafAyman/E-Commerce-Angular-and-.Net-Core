using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication4.Repositories;
using WebApplication4.View_Model;

namespace WebApplication4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IUserService _userService;
        public AuthController(IUserService userService)
        {
            _userService=userService;
        }
        // api/auth/register
        [HttpPost("Register")]
        public async Task<IActionResult> RegisterAsync(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var result = await _userService.RegisterUserAsync(model);
                    if (result.IsSucess)
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return new JsonResult(result.Message);
                    }
                }
                catch (Exception)
                {

                    return new JsonResult(false);
                }
                
            }

            return BadRequest("some properties are not vaild");
        }

        // api/auth/login
        [HttpPost("Login")]
        public async Task<IActionResult> LoginAsync ([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _userService.LoginUserAsync(model);
                if (result.IsSucess)
                {
                    return Ok(result);
                }
                else
                {
                    return new JsonResult(false);
                }
            }
            return BadRequest("Some properties are not valid");
        }

        [HttpPost("EditUser")]
        public async Task<IActionResult> EditUser([FromBody]ChangeUserDataViewModel model)
        {

            var editedUser = await _userService.UpdateUserAsync(model);

            return new JsonResult(editedUser);
        }
    }
}