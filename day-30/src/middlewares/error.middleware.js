// function handleError(err, req, res, next){
//     res.status(500).json({
//         message: err.message
//     })
// }

// export default handleError;


// // using custom status code :-
// function handleError(err, req, res, next){
//     res.status(err.status).json({
//         message: err.message,
//         stack: err.stack
//     })
// }

// export default handleError;


// using Environmental variable for checking the current environment of our node and if environment is development .. we send the stack too in response ... and if environment is production we do not send stack :-
import dotenv from "dotenv";
dotenv.config();

function handleError(err, req, res, next){
    const response = {
        message: err.message
    }

    // agar environment development wala hai to stack bhi add kardo response mein :-
    if(process.env.NODE_ENVIRONMENT === "development"){
        response.stack = err.stack;
    }

    // end mein reponse bhej denge :- 
    res.status(err.status).json(response)
}

export default handleError;

