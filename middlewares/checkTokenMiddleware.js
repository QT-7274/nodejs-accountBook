// 声明中间件
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
module.exports = (req, res, next) => {
    //验证token
    let token = req.headers.authorization;
    if (!token) {
      res.json({
        code: "2003",
        msg: "没有权限",
        data: null,
      });
      return;
    }
    //验证token是否有效
    jwt.verify(token, secret, (err, data) => {
      if (err) {
        res.json({
          code: "2004",
          msg: "没有权限",
          data: null,
        });
        return;
      }
      //保存用户信息
      req.user = data;
      next();
    });
   
  };