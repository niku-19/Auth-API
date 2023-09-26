import jwt from "jsonwebtoken"
export const checkAuth = async (req , res , next) => {
    try {

        if(!req.headers.authorization) {
            return res.status(404).json({
                success : false,
                message : "headers is required authorization token"
            })
        }

        const token = req.headers.authorization.split(" ")[1];

        if(!token) {
            return res.status(404).json({
                success: false,
                message : `token is required feild`
            })
        }

        const decode = await jwt.verify(token , process.env.JWT_SECRET);

        req.user = decode

        next();


    }catch(error) {
        return res.status(500).json({
            success: false,
            message: `error no token provided: ${error.message}`,
            data: null
        })
    }
}