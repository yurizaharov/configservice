const responses = {

    response0: {
        "code": 0,
        "status": "success"
    },

    error1: {
        "code": 1,
        "status": "error",
        "message": "General error. Something get wrong"
    },

    error102: {
        "code": 102,
        "status": "error",
        "message": "Incorrect action received"
    },

    error103: {
        "code": 103,
        "status": "error",
        "message": "Status already set"
    },

    error104: {
        "code": 104,
        "status": "error",
        "message": "Partner already exists"
    },

    response201: {
        "code": 201,
        "status": "success",
        "message": "Status was changed to "
    },

    response204: {
        "code": 204,
        "status": "success",
        "message": "Created new partner"
    },

}

module.exports = responses;
