using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using verdi_beach.Data;
using verdi_beach.Models;

namespace verdi_beach.Controllers
{
    public class ReservationController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ReservationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            ViewBag.Zones = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.ReservationZones.ToList(), "Id", "Name");
            ViewBag.MinDate = DateTime.Today.ToString("yyyy-MM-dd");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(Reservation reservation)
        {
            ViewBag.Zones = new Microsoft.AspNetCore.Mvc.Rendering.SelectList(_context.ReservationZones.ToList(), "Id", "Name");
            ViewBag.MinDate = DateTime.Today.ToString("yyyy-MM-dd");

            if (!ModelState.IsValid)
            {
              
                    
              
                var existingReservations = await _context.Reservations
                    .Where(r => r.ReservationZoneId == reservation.ReservationZoneId && r.Date == reservation.Date)
                    .CountAsync();

                var zone = await _context.ReservationZones.FindAsync(reservation.ReservationZoneId);

                if (zone != null && existingReservations >= zone.Capacity)
                {
                    ModelState.AddModelError("", "Няма свободни места в тази зона за избраната дата.");
                    return View(reservation);
                }

                _context.Reservations.Add(reservation);
                await _context.SaveChangesAsync();
                }
                return RedirectToAction("ThankYou");
            
            return View(reservation);
        }

        public IActionResult ThankYou()
        {
            return View();
        }
    }
}