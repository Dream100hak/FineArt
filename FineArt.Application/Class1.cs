using FineArt.Domain;

namespace FineArt.Application;

/// <summary>
/// 애플리케이션 서비스 마커
/// </summary>
public class ApplicationMarker
{
    // 도메인 의존성 예시
    private readonly DomainMarker _domainMarker = new();
}
