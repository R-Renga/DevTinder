const auth = (req, res,next) => {
    console.log("auth check");
    const token = "xyz";
    const isAuthorized = token === "xyz";

    if (!isAuthorized) {
        res.status(401).send("not authorized")
    } else {
        next()
    }
}

module.exports = {auth}