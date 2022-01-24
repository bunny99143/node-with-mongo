function responseModel(status,message,data) {

    const final_message = ({ 
        status: status,
        message: message,
        data: data
    });
    return final_message;
}

exports.responseModel = responseModel; 