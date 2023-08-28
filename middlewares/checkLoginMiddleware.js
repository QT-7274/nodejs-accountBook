// 声明中间件检测登录
module.exports = (req, res, next) => {
    if (!req.session.username) {
      res.redirect("/login");
      return;
    }
    next();
  };

