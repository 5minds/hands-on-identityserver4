namespace WebApp
{
  using Microsoft.AspNetCore.Hosting;
  using Microsoft.Extensions.Hosting;

  public static class Program
  {
    public static void Main(string[] args)
    {
      var hostBuilder = CreateHostBuilder(args);
      var host = hostBuilder.Build();

      host.Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
              webBuilder.UseStartup<Startup>();
            });
  }
}
