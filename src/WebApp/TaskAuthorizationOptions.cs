namespace WebApp
{
  public sealed class TaskAuthorizationOptions
  {
    public const string PolicyName = "requires_authentication_and_permission";

    public string Authority { get; set; }

    public string ApiName { get; set; }

    public string[] DesiredScopesForSensitiveActions { get; set; }
  }
}