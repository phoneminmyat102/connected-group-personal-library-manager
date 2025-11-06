const ApiResponser = () => {
    return {
        successResponse: (res, data, message = "Success") => {
            return res.status(200).json({
                status: "success",
                message,
                data,
            });
        },

        errorResponse: (res, message = "Something went wrong", statusCode = 500, errors = null) => {
            return res.status(statusCode).json({
                status: "error",
                message,
                errors,
            });
        },

        paginatedSuccessResponse: (res, data, page = 1, per_page = 10, total = 0, message = "Success") => {
            return res.status(200).json({
                status: "success",
                message,
                page,
                per_page,
                total,
                data,
            });
        },
    };
};

export default ApiResponser;
