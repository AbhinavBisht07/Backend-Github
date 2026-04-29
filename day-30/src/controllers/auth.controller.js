// export async function registerUser(req, res, next){
//     try{
//         throw new Error("encountered an error while registering new user"); 
//     } catch(err){
//         next(err);
//     }
// }


// sending status code 
// // example 1:-
// export async function registerUser(req, res, next){
//     try{
//         throw new Error("Password is too weak");
//     } catch(err){
//         err.status = 400;
//         next(err)
//     }
// }


// example 2:-
// export async function registerUser(req, res, next){
//     try{
//         throw new Error("User already exists with this email.");
//     } catch(err){
//         err.status = 409;
//         next(err);
//     }
// }




// express validator 
export async function registerUser(req, res, next){
    res.status(201).json({
        message: "User registered successfully"
    })
}
