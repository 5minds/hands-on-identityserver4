namespace WebApp.Controllers
{
  using System;
  using System.Threading.Tasks;
  using Microsoft.AspNetCore.Authorization;
  using Microsoft.AspNetCore.Mvc;
  using Microsoft.Extensions.Logging;

  [ApiController]
  [Route("api/tasks")]
  public class TaskListController : ControllerBase
  {
    private readonly TaskList taskList;
    private readonly UserResolver userResolver;
    private readonly ILogger logger;

    public TaskListController(
      TaskList taskList,
      UserResolver userResolver,
      ILogger<TaskListController> logger)
    {
      this.taskList = taskList;
      this.userResolver = userResolver;
      this.logger = logger;
    }

    [HttpGet("get-all")]
    public TaskList GetAll()
    {
      return this.taskList;
    }

    [Authorize(Policy = TaskAuthorizationOptions.PolicyName)]
    [HttpPost("add-new")]
    public async Task<IActionResult> AddNew([FromBody] NewTaskRequestPayload payload)
    {
      if (payload == null)
      {
        throw new ArgumentNullException(nameof(payload));
      }

      var owner = await this.userResolver.ResolveCurrentUserAsync();
      var newTaskItem = this.taskList.AddNew(owner, payload.Title);

      return this.Ok(newTaskItem);
    }

    [Authorize(Policy = TaskAuthorizationOptions.PolicyName)]
    [HttpPut("{taskId}/mark-as-completed")]
    public async Task<IActionResult> MarkAsCompleted([FromRoute] Guid taskId)
    {
      var matchingTaskItem = this.taskList.GetById(taskId);

      var user = await this.userResolver.ResolveCurrentUserAsync();
      matchingTaskItem.MarkAsCompleted(user);

      return this.Ok(matchingTaskItem);
    }

    [Authorize(Policy = TaskAuthorizationOptions.PolicyName)]
    [HttpPut("{taskId}/mark-as-open")]
    public async Task<IActionResult> MarkAsOpen([FromRoute] Guid taskId)
    {
      var matchingTaskItem = this.taskList.GetById(taskId);

      var user = await this.userResolver.ResolveCurrentUserAsync();
      matchingTaskItem.MarkAsOpen(user);

      return this.Ok(matchingTaskItem);
    }

    [HttpPut("reset")]
    public TaskList Reset()
    {
      this.taskList.Reset();

      return taskList;
    }

    public sealed class NewTaskRequestPayload
    {
      public string Title { get; set; }
    }
  }
}
