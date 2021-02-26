module.exports = (req, res, next) => {
    const user = req.body;
    if(!user || !user.username || !user.password) {
      res.status(401).json({message:  "username and password required"})
    } else {
     
      next();
    }

}
