using FineArt.Application;
using FineArt.Domain;

namespace FineArt.Infrastructure;

/// <summary>
/// 인프라 구성 예시
/// </summary>
public class InfrastructureMarker
{
    // 애플리케이션과 도메인 참조 예시
    private readonly ApplicationMarker _applicationMarker = new();
    private readonly DomainMarker _domainMarker = new();
}
