namespace WebApp.Controllers
{
  using System;

  public sealed class User
  {
    public static User Anonymous { get; } = new User(
      Guid.Empty.ToString("D"), 
      "Anonymous");

    public User(string ownerId, string ownerName)
    {
      this.Id = ownerId;
      this.Name = ownerName;
    }

    public string Id { get; }

    public string Name { get; }
  }
}