using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using verdi_beach.Data;
using verdi_beach.Models;

namespace verdi_beach.Controllers;

public class GalleryController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public GalleryController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    public async Task<IActionResult> Index()
    {
        var items = await _context.GalleryItems.ToListAsync();
        return View(items);
    }
    
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Upload(IFormFile file, string title)
    {
        if (file.Length == 0)
        {
            return BadRequest("No file uploaded");
        }
        
        var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }
        
        var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);
        
        using(var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }


        var galleryItem = new GalleryItem
        {
        Title = title,
        ImagePath = "/uploads/"+ uniqueFileName,
        DateUploaded = DateTime.Now,
        Likes = 0,
        IsVideo = Path.GetExtension(file.FileName).ToLower() == ".mp4"
        };
        
        _context.GalleryItems.Add(galleryItem);
        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.GalleryItems.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        var filePath = Path.Combine(_environment.WebRootPath, item.ImagePath.TrimStart('/'));
        if(System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }
        
        _context.GalleryItems.Remove(item);
        await _context.SaveChangesAsync();
        
        return RedirectToAction(nameof(Index));

    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Like(int id)
    {
        var item = await _context.GalleryItems.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        
        var like = await _context.GalleryLikes
            .FirstOrDefaultAsync(x => x.GalleryItemId == id && x.UserId == userId);

        if (like != null)
        {
           
            item.Likes = Math.Max(0, item.Likes - 1);
            _context.GalleryLikes.Remove(like);
        }
        else
        {
          
            like = new GalleryLike
            {
                GalleryItemId = id,
                UserId = userId
            };
            item.Likes++;
            _context.GalleryLikes.Add(like);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }


}