namespace verdi_beach.Models;

public class GalleryItem
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string ImagePath { get; set; }
    public int Likes { get; set; }
    public DateTime DateUploaded { get; set; }
    public string? VideoPath { get; set; }
    public bool IsVideo { get; set; }
}