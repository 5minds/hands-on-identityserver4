namespace WebApp
{
  using System;
  using WebApp.Controllers;

  public sealed class TaskItem
  {
    internal TaskItem(Guid id, User user, string title, bool isCompleted)
    {
      this.Id = id;
      this.CreatedBy = user;
      this.UpdatedBy = user;
      this.Title = title;
      this.IsCompleted = isCompleted;
    }

    public Guid Id { get; }

    public User CreatedBy { get; }

    public User UpdatedBy { get; private set; }

    public string Title { get; }

    public bool IsCompleted { get; private set; }

    public void MarkAsCompleted(User updatedBy)
    {
      if (this.IsCompleted)
      {
        throw new InvalidOperationException($"Task with ID '{this.Id}' has already been completed.");
      }

      this.UpdatedBy = updatedBy;
      this.IsCompleted = true;
    }

    public void MarkAsOpen(User updatedBy)
    {
      if (!this.IsCompleted)
      {
        throw new InvalidOperationException($"Task with ID '{this.Id}' is already in unfinished state.");
      }

      this.UpdatedBy = updatedBy;
      this.IsCompleted = false;
    }
  }
}
