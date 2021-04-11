using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication4.Data;
using WebApplication4.Models;
using WebApplication4.Repositories;

namespace WebApplication4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IReview _review;

        public ReviewsController(ApplicationDbContext context,IReview review)
        {
            _context = context;
            _review=review;
        }

        // GET: api/Reviews
        [HttpGet]
        public ActionResult GetReviews()
        {
            try
            {
                var reviews= _review.GetAllReviews();
                return Ok(reviews);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // GET: api/Reviews/5
        [HttpGet("{id}")]
        public ActionResult GetReview(int id)
        {
            try
            {
            var review =  _review.GetReviewById(id);
                return new JsonResult(review);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // PUT: api/Reviews/5
        [HttpPut("{id}")]
        public IActionResult PutReviews(int id, Reviews reviews)
        {
            if (id != reviews.ReviewId)
            {
                return BadRequest();
            }
            try
            {
                _review.EditReview(reviews);
                return new JsonResult(true);
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // POST: api/Reviews
        [HttpPost]
        public ActionResult PostReviews(Reviews reviews)
        {
           try
            {
                _review.AddReview(reviews);
                return new JsonResult(true); 
            }
            catch (Exception)
            {
                return new JsonResult(false);
            }
        }

        // DELETE: api/Reviews/5
        [HttpDelete("{id}")]
        public ActionResult DeleteReviews(int id)
        {
          try
            {
                _review.DeleteReview(id);
                return new JsonResult(true);
            }
            catch (Exception)
            {

                return new JsonResult(false);
            }  
        }
    }
}
