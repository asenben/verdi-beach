using System.ComponentModel.DataAnnotations;

namespace verdi_beach.Models;

public class Reservation
{
    public int Id { get; set; } // Main key
    [Required]
    public string Name { get; set; }
    [Required, Phone]
    public string Phone { get; set; }
    [Required, EmailAddress]
    public string Email { get; set; }
    [Required, DataType(DataType.Date)]
    public DateTime Date { get; set; }
    [Required, DataType(DataType.Time)]
    public TimeSpan Time { get; set; }

    [Required]
    public int ReservationZoneId { get; set; } // Foreign key
    public ReservationZone ReservationZone { get; set; }

    [Required]
    public string Guests { get; set; } // брой гости

    public string? Message { get; set; }
}