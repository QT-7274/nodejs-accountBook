var express = require("express");
var router = express.Router();
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const secret = require("../../config/config");
const UserModel = require("../../models/UserModel");
router.post("/login", (req, res) => {
  //查询数据库
  let { username, password } = req.body;
  UserModel.findOne({ username, password: md5(password) })
    .then((data) => {
      if (!data) {
        res.json({ code: '2002', msg: "用户名或密码错误", data: null });
        return;
      }
      let token = jwt.sign({ 
        username: data.username,_id:data._id }, secret, {
        expiresIn: 60 * 60 * 24,
      });

      res.json({
        code: '0000',
        msg: "登录成功",
        data:token
      });
    })
    .catch((err) => {
      if (err) {
        // res.status(500).send("登录失败");
        res.json({ code: '2001', msg: "登录失败", data: null });
      }
    });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.render("success", { msg: "退出成功", url: "/login" });
  });
});

module.exports = router;
