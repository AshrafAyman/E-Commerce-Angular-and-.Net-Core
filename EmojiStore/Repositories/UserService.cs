using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Models;
using WebApplication4.View_Model;

namespace WebApplication4.Repositories
{
    public interface IUserService
    {
        Task<UserManagerResponse> RegisterUserAsync(RegisterViewModel model);
        Task<UserManagerResponse> LoginUserAsync(LoginViewModel model);
        Task<UserManagerResponse> UpdateUserAsync(ChangeUserDataViewModel model);
    }
    public class UserService : IUserService
    {
        private ApplicationDbContext _context;
        private UserManager<ApplicationUser> _userManager;
        private IConfiguration _configuration;
        public UserService(UserManager<ApplicationUser> userManager,IConfiguration configuration, ApplicationDbContext context)
        {
            _userManager=userManager;
            _configuration=configuration;
            _context = context;
        }
        public async Task<UserManagerResponse> RegisterUserAsync(RegisterViewModel model)
        {
            
            if (model == null)
            {
                throw new NullReferenceException("Rigester Model is null");
            }

            if (model.Password != model.ConfirmPassword)
            {
                return new UserManagerResponse
                {
                    Message = "Confirm password dosn't match the password",
                    IsSucess = false,
                };
            }
            var identityUser = new ApplicationUser
            {
                Email = string.IsNullOrEmpty(model.Email)?"": model.Email,
                UserName = model.Phone,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Address =string.IsNullOrEmpty(model.Address)?"" : model.Address,
                PhoneNumber = model.Phone
            };
            var result = await _userManager.CreateAsync(identityUser,model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(identityUser, Enums.Roles.NormalUser.ToString());
                var registeredUser = await _userManager.FindByNameAsync(identityUser.UserName);
                var roleId = _context.UserRoles.FirstOrDefault(e => e.UserId == registeredUser.Id)?.RoleId;
                var roleName = _context.Roles.FirstOrDefault(e => e.Id == roleId)?.Name;
                if (registeredUser != null)
                {
                    var customer = new Customer
                    {
                        CustomerName = registeredUser.FirstName + " " + registeredUser.LastName,
                        Address = string.IsNullOrEmpty(registeredUser.Address) ? "" : registeredUser.Address,
                        Email = string.IsNullOrEmpty(registeredUser.Email) ? "" : registeredUser.Email,
                        Phone = registeredUser.PhoneNumber,
                        UserId = registeredUser.Id
                    };
                    _context.Customers.Add(customer);
                    _context.SaveChanges();
                }
                return new UserManagerResponse
                {
                    Message = "User created successfully",
                    IsSucess = true,
                    Customer = new CustomerViewModel
                    {
                        UserId = registeredUser.Id,
                        UserName = registeredUser.FirstName + " " + registeredUser.LastName,
                        Email=registeredUser.Email,
                        FirstName=registeredUser.FirstName,
                        LastName=registeredUser.LastName,
                        Address=registeredUser.Address,
                        Phone=registeredUser.PhoneNumber,
                        Role=roleName
                    },
                };
            }

            return new UserManagerResponse
            {
                Message = "User is already exist",
                IsSucess = false,
                Errors = result.Errors.Select(e=>e.Description)
            };
        }

        public async Task<UserManagerResponse> LoginUserAsync(LoginViewModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Phone);
            var result = await _userManager.CheckPasswordAsync(user,model.Password);
            if (!result)
            {
                return new UserManagerResponse
                {
                    Message="Invalid password",
                    IsSucess=false
                };
            }
            var claims = new []
            {
                new Claim ("Phone",user.PhoneNumber),
                new Claim (ClaimTypes.NameIdentifier,user.Id),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AuthSettings:Key"]));

            var token = new JwtSecurityToken(
                issuer:_configuration["AuthSettings:Issuer"],
                audience:_configuration["AuthSettings:Audience"],
                claims:claims,
                expires:DateTime.Now.AddDays(30),
                signingCredentials:new SigningCredentials(key,SecurityAlgorithms.HmacSha256)
                );

            string tokenAsString = new JwtSecurityTokenHandler().WriteToken(token);

            var roleId = _context.UserRoles.FirstOrDefault(e => e.UserId == user.Id)?.RoleId;
            var roleName = _context.Roles.FirstOrDefault(e => e.Id == roleId)?.Name;
            return new UserManagerResponse
            {

                Token = tokenAsString,
                IsSucess = true,
                ExpireDate = token.ValidTo,
                Customer = new CustomerViewModel
                {
                    UserId = user.Id,
                    UserName = user.FirstName + " " + user.LastName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Address = user.Address,
                    Phone = user.PhoneNumber,
                    Role = roleName
                },
            };
        }

        public async Task<UserManagerResponse> UpdateUserAsync(ChangeUserDataViewModel model) {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user != null)
            {
                user.Email = model.Email;
                user.PhoneNumber = model.Phone;
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.Address = model.Address;
            }
            var result = await _userManager.UpdateAsync(user);
            
            if (result.Succeeded)
            {

                var editCustomer = _context.Customers.FirstOrDefault(e => e.UserId == model.UserId);
                if (editCustomer != null)
                {
                    editCustomer.Phone = user.PhoneNumber;
                    editCustomer.Email = user.Email;
                    editCustomer.Address = user.Address;
                    editCustomer.CustomerName = user.FirstName + " " + user.LastName;
                    _context.SaveChanges();
                }

                var roleId = _context.UserRoles.FirstOrDefault(e => e.UserId == user.Id)?.RoleId;
                var roleName = _context.Roles.FirstOrDefault(e => e.Id == roleId)?.Name;
                return new UserManagerResponse
                {
                    IsSucess = true,
                    Customer = new CustomerViewModel
                    {
                        UserId = user.Id,
                        UserName = user.FirstName + " " + user.LastName,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Address = user.Address,
                        Phone = user.PhoneNumber,
                        Role = roleName
                    },
                    Token=model.Token
                };
            }
            return new UserManagerResponse
            {
                IsSucess = false,
                Token=model.Token,
                Errors = result.Errors.Select(e => e.Description)
            };
        }
    }
}
