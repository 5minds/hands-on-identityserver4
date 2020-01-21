namespace WebApp
{
  using Microsoft.AspNetCore.Builder;
  using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
  using Microsoft.Extensions.Configuration;
  using Microsoft.Extensions.DependencyInjection;
  using Microsoft.Extensions.Options;
  using WebApp.Controllers;

  public class Startup
  {
    private readonly IConfiguration configuration;

    public Startup(IConfiguration configuration)
    {
      this.configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddHttpContextAccessor();
      services.AddScoped<ErrorHandlingMiddleware>();
      services.AddSingleton<TaskList>();
      services.AddScoped<UserResolver>();
      services.AddControllersWithViews();

      var authorizationOptions = this.configuration.GetSection("Authorization").Get<TaskAuthorizationOptions>();
      services.AddSingleton(Options.Create(authorizationOptions));

      // TODO: Configure authentication service.
      // TODO: Use policy by request filter or controller action attributes.
      services.AddAuthorization(options =>
      {
        options.AddPolicy(TaskAuthorizationOptions.PolicyName, policy =>
        {
          policy.RequireAuthenticatedUser();

          foreach (var desiredScope in authorizationOptions.DesiredScopesForSensitiveActions)
          {
            policy.RequireClaim("scope", desiredScope);
          }
        });
      });

      services.AddSpaStaticFiles(options =>
      {
        options.RootPath = "ClientApp/build";
      });
    }

    public void Configure(IApplicationBuilder app)
    {
      app.UseMiddleware<ErrorHandlingMiddleware>();
      app.UseHsts();
      app.UseHttpsRedirection();
      app.UseStaticFiles();
      app.UseSpaStaticFiles();
      app.UseRouting();
      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute(
          name: "default",
          pattern: "{controller}/{action=Index}/{id?}");
      });

      app.UseSpa(spa =>
      {
        spa.Options.SourcePath = "ClientApp";
        spa.UseReactDevelopmentServer(npmScript: "start");
      });
    }
  }
}
