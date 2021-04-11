using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication4.View_Model
{
    public class UserManagerResponse
    {
        public string Message { get; set; }
        public bool IsSucess { get; set; }
        public IEnumerable<string> Errors { get; set; }
        public DateTime? ExpireDate { get; set; }
        public string Token { get; set; }
        public CustomerViewModel Customer { get; set;}
    }
}
