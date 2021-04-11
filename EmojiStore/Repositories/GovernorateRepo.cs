using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Models;

namespace WebApplication4.Repositories
{
    public interface IGovernorate
    {
        IEnumerable<Governorate> GetAllCustomers();
        Governorate GetGovernorateById(int id);
        bool AddGovernorate(Governorate governorate);
        bool EditGovernorate(Governorate governorate);
        bool DeleteGovernorate(int id);
        bool GovernorateExists(int id);

    }
    public class GovernorateRepo : IGovernorate
    {
        ApplicationDbContext _context;
        public GovernorateRepo(ApplicationDbContext context)
        {
            _context=context;
        }
        public bool AddGovernorate(Governorate governorate)
        {
            _context.Governorates.Add(governorate);
            _context.SaveChanges();
            return true;
        }

        public bool DeleteGovernorate(int id)
        {
            var governorate = _context.Governorates.Find(id);
            if (governorate != null)
            {
                 _context.Governorates.Remove(governorate);
                 _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool EditGovernorate(Governorate governorate)
        {
            _context.Entry(governorate).State = EntityState.Modified;
            _context.SaveChanges();
            return true;
        }

        public IEnumerable<Governorate> GetAllCustomers()
        {
            return  _context.Governorates.ToList();
        }

        public Governorate GetGovernorateById(int id)
        {
           return _context.Governorates.FirstOrDefault(e => e.GovernorateId == id);
        }

        public bool GovernorateExists(int id)
        {
            return _context.Governorates.Any(e => e.GovernorateId == id);
        }
    }
}
