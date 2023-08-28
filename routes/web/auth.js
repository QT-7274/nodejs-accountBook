var express = require("express");
const UserModel = require("../../models/UserModel");
var router = express.Router();
const md5 = require("md5");
router.get("/reg", (req, res) => {
  res.render("auth/reg");
});

router.post("/reg", (req, res) => {
  UserModel.create({ ...req.body, password: md5(req.body.password) })
    .then((data) => {
      res.render("success", { msg: "注册成功", url: "/login" });
    })
    .catch((err) => {
      res.status(500).send("注册失败");
      return;
    });
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  //查询数据库
  let { username, password } = req.body;
  UserModel.findOne({ username, password: md5(password) })
    .then((data) => {
        if(!data){
            res.status(500).send("登录失败");
            return;
        }
        req.session.username = data.username;

        req.session._id = data._id;

        res.render("success", { msg: "登录成功", url: "/account" });
    })
    .catch((err) => {
        if(err){
            res.status(500).send("登录失败");
        }
    });
});

router.post("/logout", (req, res) => {
    req.session.destroy(()=>{
       res.render("success", { msg: "退出成功", url: "/login" });
    });
});

module.exports = router;
