using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Models;
using WebApplication4.View_Model;

namespace WebApplication4.Repositories
{
    public interface ISize
    {
        IEnumerable<Sizes> GetAllSizes();
        SizesViewModel GetSizeById(int id);
        bool AddSize(SizesViewModel size);
        bool EditSize(SizesViewModel size);
        bool DeleteSize(int id);
    }
    public class SizesRepo : ISize
    {
        ApplicationDbContext _context;
        public SizesRepo(ApplicationDbContext context)
        {
            _context = context;
        }
        public bool AddSize(SizesViewModel size)
        {
            Sizes newSize = new Sizes()
            {
                Name = size.Name
            };
            _context.Sizes.Add(newSize);
            _context.SaveChanges();
            return true;
        }

        public bool DeleteSize(int id)
        {
            var size = _context.Sizes.Find(id);
            if (size != null)
            {
                _context.Sizes.Remove(size);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool EditSize(SizesViewModel size)
        {
            var editedSize = _context.Sizes.Find(size.SizeId);
            if (editedSize != null)
            {
                editedSize.Name = size.Name;
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public IEnumerable<Sizes> GetAllSizes()
        {
            return _context.Sizes.ToList();
        }

        public SizesViewModel GetSizeById(int id)
        {
            var selectedSize= _context.Sizes.FirstOrDefault(e => e.SizeId == id);
            SizesViewModel size = new SizesViewModel()
            {
                SizeId = selectedSize.SizeId,
                Name = selectedSize.Name
            };
            return size;
        }
    }
}
