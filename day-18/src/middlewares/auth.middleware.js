const jwt = require("jsonwebtoken")


async function identifyUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({
            message: "Token not provided, Unauthorized access"
        })
    }

    let decoded = null
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token / User not authorized"
        })
    }
    
    req.user = decoded; // created new property inside req ... and set its value equal to decoded...

    // request ko aage forward karna hai controller pe humko .. to request ko aage forward karne ke liye we use a method "next" :-
    next();
}
module.exports = identifyUser;




// const jwt = require("jsonwebtoken")


// async function identifyUser(req, res, next) {
//     // token ko access kar lenge user ke 
//     const token = req.cookies.token;

//     // agar kisi user pe token nahi hoga to iske 2 reasons hain .... ya to usnne register hi nahi kar rakha ... ya fir usne kabhi register kia tha and ab uska purana token expire ho chuka hai and usne dobara login nahi kia ...
//     if (!token) {
//         res.status(401).json({
//             message: "Token not provided, Unauthorized access"
//         })
//     }

//     //decoded ke andar wahi data aajaega jo token banate wakt bheja tha humne .. yaani user ki id ajaegi ...
//     let decoded = null
//     try {
//         decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//         return res.status(401).json({
//             message: "Invalid token / User not authorized"
//         })
//     }
//     // console.log(decoded);


//     req.user = decoded; // created new property inside req ... and set its value equal to decoded...
// }


// module.exports = identifyUser;