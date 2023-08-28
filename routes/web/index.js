const express = require("express");
const router = express.Router();
// 导入moment
const moment = require("moment");
const AccountModel = require("../../models/AccountModels");


const checkLoginMiddleware = require("../../middlewares/checkLoginMiddleware");

 /**
   * 以下注释掉的代码为没有引入数据库时的代码
   */
// // 导入lowdb
// const low = require("lowdb");
// const FileSync = require("lowdb/adapters/FileSync");
// const adapter = new FileSync(__dirname + "/../data/db.json"); // 申明一个适配器

// const db = low(adapter); // lowdb接收适配器，返回db对象
// // 导入shortid，在没有引入数据库之前可以这样创建独一无二的id
// const shortid = require("shortid");



//添加首页路由
router.get('/', (req, res) => {
  res.redirect('/account');
});
//记账本的列表
router.get("/account", checkLoginMiddleware,function (req, res, next) {

  if(!req.session.username){
    res.redirect("/login");
    return;
  }

  // 获取所有账单的数据
  AccountModel.find({user:req.session._id}).sort({ time: -1 }).then((data) => {
   
    res.render("list", { accounts: data ,username:req.session.username,moment:moment});
  }).catch((err) => {
    if (err) {
      res.status(500).send("查询失败");
    }
    return;
  });
  /**
   * 以下注释掉的代码为没有引入数据库时的代码
   */
  // let accounts = db.get("accounts").value();
  // res.render("list", { accounts });
});

//记账本的添加页面
router.get("/account/create", checkLoginMiddleware, function (req, res, next) {
  res.render("create");
});

//新增账单
router.post("/account",checkLoginMiddleware, (req, res) => {
  //查看表单数据
  if(!req.session.username){
    res.redirect("/login");
    return;
  }
  const userId = req.session._id;
  // 将用户ID与账单数据关联
  const accountData = { ...req.body, user:userId, time: moment(req.body.time).toDate()}
  //注意要把日期字符串转换为日期格式 2023-02-24 => new Date()
  // 插入数据库
  AccountModel.create(accountData)
    .then((data) => {
      res.render("success", { msg: "添加成功", url: "/account" });
    })
    .catch((err) => {
      if (err) {
        res.status(500).send("插入失败");
      }
      return;
    });

  /**
   * 以下注释掉的代码为没有引入数据库时的代码
   */
  // // 生成id
  // let id = shortid.generate();
  //  //写入文件
  //  db.get('accounts').unshift({id:id,...req.body}).write();
  //成功提醒
  // res.render('success',{msg:'添加成功', url:'/account'})
});

//删除账单
router.get("/account/delete/:id",checkLoginMiddleware, (req, res) => {
  //删除数据
  AccountModel.deleteOne({ _id: req.params.id })
    .then((data) => {
      res.render("success", { msg: "删除成功", url: "/account" });
    })
    .catch((err) => {
      if (err) {
        res.status(500).send("删除失败");
      }
      return;
    });

  /**
   * 以下注释掉的代码为没有引入数据库时的代码
   */
  // // 获取id
  // let id = req.params.id;
  // // 删除数据
  // db.get("accounts").remove({ id }).write();
  // // 成功提醒
  // res.render("success", { msg: "删除成功", url: "/account" });
});

module.exports = router;
