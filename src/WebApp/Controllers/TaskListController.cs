namespace WebApp.Controllers
{
  using System;
  using System.Threading.Tasks;
  using Microsoft.AspNetCore.Mvc;

  [ApiController]
  [Route("api/tasks")]
  public class TaskListController : ControllerBase
  {
    private readonly TaskList taskList;
    private readonly UserResolver userResolver;

    public TaskListController(
      TaskList taskList,
      UserResolver userResolver)
    {
      this.taskList = taskList;
      this.userResolver = userResolver;
    }

    [HttpGet("get-all")]
    public TaskList GetAll()
    {
      return this.taskList;
    }

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

    [HttpPut("{taskId}/mark-as-completed")]
    public async Task<IActionResult> MarkAsCompleted([FromRoute] Guid taskId)
    {
      var matchingTaskItem = this.taskList.GetById(taskId);

      var user = await this.userResolver.ResolveCurrentUserAsync();
      matchingTaskItem.MarkAsCompleted(user);

      return this.Ok(matchingTaskItem);
    }

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
