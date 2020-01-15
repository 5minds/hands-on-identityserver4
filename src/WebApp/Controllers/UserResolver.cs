namespace WebApp.Controllers
{
  using System;
  using System.Linq;
  using System.Net.Http;
  using System.Security.Claims;
  using System.Threading.Tasks;
  using IdentityModel.Client;
  using Microsoft.AspNetCore.Authentication;
  using Microsoft.AspNetCore.Http;
  using Microsoft.Extensions.Caching.Memory;
  using Microsoft.Extensions.Logging;
  using Microsoft.Extensions.Options;

  public sealed class UserResolver
  {
    private readonly IHttpContextAccessor httpContextAccessor;
    private readonly HttpClient httpClient;
    private readonly IOptions<TaskAuthorizationOptions> authorizationOptionsAccessor;
    private readonly IMemoryCache memoryCache;
    private readonly ILogger logger;
    private Uri userInfoEndpoint;

    public UserResolver(
      IHttpContextAccessor httpContextAccessor,
      IOptions<TaskAuthorizationOptions> authorizationOptionsAccessor,
      IMemoryCache memoryCache,
      ILogger<UserResolver> logger)
    {
      this.httpContextAccessor = httpContextAccessor;
      this.httpClient = new HttpClient();
      this.authorizationOptionsAccessor = authorizationOptionsAccessor;
      this.memoryCache = memoryCache;
      this.logger = logger;
    }

    public async Task<User> ResolveCurrentUserAsync()
    {
      var httpContext = this.httpContextAccessor.HttpContext;
      var identity = httpContext.User?.Identity as ClaimsIdentity;

      if (identity == null || !identity.IsAuthenticated)
      {
        return User.Anonymous;
      }

      try
      {
        var userId = identity.Claims.Single(p => p.Type == "sub").Value;

        if (this.memoryCache.TryGetValue(userId, out User user))
        {
          return user;
        }
        else
        {
          var accessToken = await httpContext.GetTokenAsync("access_token");
          var expirationTimeAsUnixTimestamp = long.Parse(identity.Claims.Single(p => p.Type == "exp").Value);
          var expirationTime = DateTimeOffset.FromUnixTimeSeconds(expirationTimeAsUnixTimestamp).DateTime.ToLocalTime();

          user = await this.RetrieveUserProfileAsync(accessToken);

          this.memoryCache.Set(userId, user, expirationTime);

          return user;
        }
      }
      catch (Exception exception)
      {
        this.logger.LogError(exception, "Resolving user has failed.");
        return User.Anonymous;
      }
    }

    private async Task<User> RetrieveUserProfileAsync(string accessToken)
    {
      if (this.userInfoEndpoint == null)
      {
        this.userInfoEndpoint = await this.RetrieveUserInfoEndpointAsync();
      }

      var userInfo = await this.httpClient.GetUserInfoAsync(new UserInfoRequest()
      {
        Address = this.userInfoEndpoint.AbsoluteUri,
        Token = accessToken
      });

      if (userInfo.IsError)
      {
        throw new InvalidOperationException("User info could not be read.", userInfo.Exception);
      }

      var userId = userInfo.Claims.FirstOrDefault(p => p.Type == "sub")?.Value;
      var userName = userInfo.Claims.FirstOrDefault(p => p.Type == "given_name")?.Value;

      return new User(userId, userName);
    }

    private async Task<Uri> RetrieveUserInfoEndpointAsync()
    {
      var authorizationOptions = this.authorizationOptionsAccessor.Value;
      var discoveryDocument = await this.httpClient.GetDiscoveryDocumentAsync(authorizationOptions.Authority);

      if (discoveryDocument.IsError)
      {
        throw new InvalidOperationException("Discovery document could not be read.", discoveryDocument.Exception);
      }

      return new Uri(discoveryDocument.UserInfoEndpoint, UriKind.Absolute);
    }
  }
}