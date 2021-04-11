using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication4.Data;
using WebApplication4.Models;

namespace WebApplication4.Repositories
{
    public interface IReview
    {
        IEnumerable<Reviews> GetAllReviews();
        Reviews GetReviewById(int id);
        bool AddReview(Reviews reviews);
        bool EditReview(Reviews reviews);
        bool DeleteReview(int id);
        bool ReviewExists(int id);

    }
    public class ReviewsRepo : IReview
    {
        ApplicationDbContext _context;
        public ReviewsRepo(ApplicationDbContext context)
        {
            _context=context;
        }
        public bool AddReview(Reviews reviews)
        {
            _context.Reviews.Add(reviews);
            _context.SaveChanges();
            return true;
        }

        public bool DeleteReview(int id)
        {
            var review = _context.Reviews.Find(id);
            if (review != null)
            {
                 _context.Reviews.Remove(review);
                 _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool EditReview(Reviews reviews)
        {
            _context.Entry(reviews).State = EntityState.Modified;
            _context.SaveChanges();
            return true;
        }

        public IEnumerable<Reviews> GetAllReviews()
        {
            return  _context.Reviews.ToList();
        }

        public Reviews GetReviewById(int id)
        {
            return _context.Reviews.FirstOrDefault(e => e.ReviewId == id);
        }

        public bool ReviewExists(int id)
        {
            return _context.Reviews.Any(e => e.ReviewId == id);
        }
    }
}
