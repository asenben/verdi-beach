using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using verdi_beach.Models;

namespace verdi_beach.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {

        builder.Entity<ReservationZone>().HasData(
            new ReservationZone { Id = 1, Name = "Шезлонг с чадър и маса" , Capacity = 10},
            new ReservationZone { Id = 2, Name = "Голяма шатра" , Capacity = 5}
        );
        
        base.OnModelCreating(builder);
    }

    public DbSet<GalleryItem> GalleryItems { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    
    public DbSet<ReservationZone> ReservationZones { get; set; }
    
    public DbSet<GalleryLike> GalleryLikes { get; set; }

}