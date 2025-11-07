using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FineArt.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg"
    };

    private const long MaxFileSizeBytes = 10 * 1024 * 1024;

    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<UploadsController> _logger;

    public UploadsController(IWebHostEnvironment environment, ILogger<UploadsController> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [RequestSizeLimit(MaxFileSizeBytes)]
    public async Task<IActionResult> Upload([FromForm] IFormFile file, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "업로드할 파일이 필요합니다." });
        }

        if (file.Length > MaxFileSizeBytes)
        {
            return BadRequest(new { message = "파일 크기는 최대 10MB까지 허용됩니다." });
        }

        var extension = Path.GetExtension(file.FileName);
        if (!AllowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "지원하지 않는 이미지 형식입니다." });
        }

        var webRoot = _environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        var uploadsRoot = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadsRoot);

        var fileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using (var stream = System.IO.File.Create(filePath))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var request = HttpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";
        var url = $"{baseUrl}/uploads/{fileName}";

        _logger.LogInformation("Uploaded file {FileName} ({Size} bytes)", fileName, file.Length);

        return Ok(new
        {
            url,
            fileName,
            size = file.Length,
            contentType = file.ContentType
        });
    }
}
