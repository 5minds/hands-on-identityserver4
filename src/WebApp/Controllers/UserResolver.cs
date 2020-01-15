namespace WebApp.Controllers
{
  using System.Threading.Tasks;

  public sealed class UserResolver
  {
    public Task<User> ResolveCurrentUserAsync()
    {
      // TODO: Resolve the current user
      return Task.FromResult(User.Anonymous);
    }
  }
}