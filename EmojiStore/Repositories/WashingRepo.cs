using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Models;
using WebApplication4.View_Model;

namespace WebApplication4.Repositories
{
    public interface IWash { 
    
        IEnumerable<Washing> GetAllWashingTypes();
        WashingViewModel GetWashTypeById(int id);
        bool AddWashngType(WashingViewModel model);
        bool EditWashngType(WashingViewModel model);
        bool DeleteWashngType(int id);
    }
    public class WashingRepo : IWash
    {
        ApplicationDbContext _context;
        public WashingRepo(ApplicationDbContext context)
        {
            _context = context;
        }
        public bool AddWashngType(WashingViewModel model)
        {
            Washing washing = new Washing
            {
                Title = model.Title,
                Description=model.Description
            };
            _context.Washings.Add(washing);
            _context.SaveChanges();
            return true;
        }

        public bool DeleteWashngType(int id)
        {
            var model = _context.Washings.Find(id);
            if (model != null)
            {
                _context.Washings.Remove(model);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool EditWashngType(WashingViewModel model)
        {
            var editedWashing = _context.Washings.Find(model.Id);
            if (editedWashing != null)
            {
                editedWashing.Title = model.Title;
                editedWashing.Description = model.Description;
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public IEnumerable<Washing> GetAllWashingTypes()
        {
            return _context.Washings.ToList();
        }

        public WashingViewModel GetWashTypeById(int id)
        {

            var model = _context.Washings.FirstOrDefault(e => e.Id == id);
            WashingViewModel wash = new WashingViewModel()
            {
                Title=model.Title,
                Description=model.Description
            };
            return wash;
        }
    }
}
