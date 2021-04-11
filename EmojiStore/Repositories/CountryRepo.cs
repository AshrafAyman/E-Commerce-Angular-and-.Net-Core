using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Models;

namespace WebApplication4.Repositories
{
    public interface ICountry
    {
        IEnumerable<Country> GetAllCountries();
        Country GetCountryById(int id);
        bool AddCountry(Country country);
        bool EditCountry(Country country);
        bool DeleteCountry(int id);
        bool CountryExists(int id);

    }
    public class CountryRepo : ICountry
    {
        ApplicationDbContext _context;
        public CountryRepo(ApplicationDbContext context)
        {
            _context=context;
        }

        public bool AddCountry(Country country)
        {
            _context.Countries.Add(country);
            _context.SaveChanges();
            return true;
        }

        public bool CountryExists(int id)
        {
            return _context.Countries.Any(e => e.CountryId == id);
        }

        public bool DeleteCountry(int id)
        {
            var country = _context.Countries.Find(id);
            if (country != null)
            {
                 _context.Countries.Remove(country);
                 _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool EditCountry(Country country)
        {
            _context.Entry(country).State = EntityState.Modified;
            _context.SaveChanges();
            return true;
        }

        public IEnumerable<Country> GetAllCountries()
        {
            return  _context.Countries.ToList();
        }

        public Country GetCountryById(int id)
        {
            return _context.Countries.FirstOrDefault(e => e.CountryId == id);
        }
    }
}
