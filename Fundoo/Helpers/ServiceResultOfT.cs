namespace Fundoo.Helpers;

public class ServiceResult<T> : ServiceResult
{
    public T? Data { get; set; }

    public static ServiceResult<T> Ok(T data, string message = "")
    {
        return new ServiceResult<T> { Success = true, Data = data, Message = message };
    }

    public new static ServiceResult<T> Fail(string message)
    {
        return new ServiceResult<T> { Success = false, Message = message };
    }
}
