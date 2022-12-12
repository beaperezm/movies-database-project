//Creating this util to re-use it more times in the project, because we don´t want to repeat this code a lot of times

const createError = (sms, status) => {
    const error = new Error(sms);
    error.status = status;
    return error;
};
module.exports = createError;