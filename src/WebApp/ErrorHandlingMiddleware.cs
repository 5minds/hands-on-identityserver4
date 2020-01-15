namespace WebApp
{
  using System;
  using System.Net;
  using System.Threading.Tasks;
  using Microsoft.AspNetCore.Http;
  using Newtonsoft.Json;

  internal sealed class ErrorHandlingMiddleware : IMiddleware
  {
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
      try
      {
        await next(context);
      }
      catch (Exception exception)
      {
        await this.HandleExceptionAsync(context, exception);
      }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
      var result = JsonConvert.SerializeObject(exception);

      context.Response.ContentType = "application/json";
      context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

      if (!context.Response.Headers.ContainsKey("Access-Control-Allow-Origin"))
      {
        context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
      }

      return context.Response.WriteAsync(result);
    }

  }
}