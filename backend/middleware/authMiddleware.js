import JWT from "jsonwebtoken";

const authMiddleWare = async(req, res, next) => {
    const authHeader = req?.headers?.authorization;
    if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return res.status(401).json({ 
        status: "auth_failed", 
        message: "Authentication failed" });
    }
    try {
        const userToken = JWT.verify(token, process.env.JWT_SECRET);
        req.body.user = {
            userId: userToken.userId,
        };
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: "failed",
            message: "Authentication failed"
        });
    }
};

export default authMiddleWare;