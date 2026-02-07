/******************************************************************************
 * Business Service: [Name]
 * Description: [Description]
 * Created: [Date]
 * Author: [Name]
 ******************************************************************************/

function Service_PreInvokeMethod (MethodName, Inputs, Outputs)
{
    if (MethodName == "MyMethod")
    {
        try
        {
            // Business Logic Here
            MyMethod(Inputs, Outputs);
            return (CancelOperation);
        }
        catch (e)
        {
            TheApplication().RaiseErrorText("Error in " + MethodName + ": " + e.toString());
        }
    }
    return (ContinueOperation);
}

function MyMethod(Inputs, Outputs)
{
    // Implementation
}
