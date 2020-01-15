namespace WebApp.Controllers
{
  using System;
  using System.Collections.Generic;
  using System.Collections.ObjectModel;
  using System.Linq;

  public sealed class TaskList : ReadOnlyCollection<TaskItem>
  {
    public TaskList()
      : base(new List<TaskItem>())
    {
      this.Reset();
    }

    public TaskItem AddNew(User user, string title)
    {
      var desiredId = Guid.NewGuid();

      var newTaskItem = new TaskItem(
        desiredId,
        user,
        title,
        false);

      this.Items.Add(newTaskItem);

      return newTaskItem;
    }

    public TaskItem GetById(Guid taskId)
    {
      var matchingTaskItem = this.FirstOrDefault(p => p.Id == taskId);

      if (matchingTaskItem == null)
      {
        throw new KeyNotFoundException($"Task with ID '{taskId}' was not found.");
      }

      return matchingTaskItem;
    }

    public void Reset()
    {
      var taskItems = new TaskItem[]
      {
        new TaskItem(
          Guid.Parse("2AC5CA2F-428A-4D75-8915-221B732D313F"),
          User.Anonymous,
          "Something to do",
          false), 

        new TaskItem(
          Guid.Parse("C6D52B0B-33F8-46F5-B580-AD0B6C4BE05B"),
          User.Anonymous,
          "Another thing to do",
          true), 

        new TaskItem(
          Guid.Parse("317DE275-DBE8-4078-B61A-9FB5A9496546"),
          User.Anonymous,
          "Urgent thing to do",
          false), 

        new TaskItem(
          Guid.Parse("5DD814C2-C6CA-4B69-9709-87B20AB64DC6"),
          User.Anonymous,
          "Thing to procrastinate",
          false), 

        new TaskItem(
          Guid.Parse("302FE7FC-38C7-4D08-9EF8-FE3FC6C3BB00"),
          User.Anonymous,
          "Something I have done last year",
          true), 
      };
      
      this.Items.Clear();

      foreach (var taskItem in taskItems)
      {
        this.Items.Add(taskItem);
      }
    }
  }
}