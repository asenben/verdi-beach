namespace verdi_beach.Models;

public class ReservationZone
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Capacity { get; set; }
    
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}