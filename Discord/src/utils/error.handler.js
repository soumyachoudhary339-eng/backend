class ApiErrorHandler extends Error {
    constructor(
        statusCode,
        message="something went wrong",
        stack="",
        errors=[]
    ){
        super(message),
        this.statusCode=statusCode,
        this.stack=stack,
        this.errors=errors
        this.data=null
        this.success=false
        this.message=message
        if(stack) {
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)

        }
    }
}

export default ApiErrorHandler