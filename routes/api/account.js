const express = require("express");
const router = express.Router();
/**
 * 注意：此文件中的代码没有用户和账单的一一对应关系，只有web文件夹下的index.js中的代码才有
 */
const checkTokenMiddleware = require("../../middlewares/checkTokenMiddleware");
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



// 导入moment
const moment = require("moment");
const AccountModel = require("../../models/AccountModels");

//记账本的列表
router.get("/account", checkTokenMiddleware, function (req, res, next) {
  // 获取所有账单的数据
  AccountModel.find()
    .sort({ time: -1 })
    .then((data) => {
      // res.render("list", { accounts: data ,moment:moment});
      //如果为ajax请求，返回json数据
      res.json({
        code: "0000",
        msg: "查询成功",
        data: data,
      });
    })
    .catch((err) => {
      if (err) {
        // res.status(500).send("查询失败");
        res.json({
          code: "0001",
          msg: "查询失败",
          data: null,
        });
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
//在接口中不需要添加页面
// router.get("/account/create", function (req, res, next) {
//   res.render("create");
// });

//新增账单
router.post("/account", checkTokenMiddleware,(req, res) => {
  //查看表单数据
  //注意要把日期字符串转换为日期格式 2023-02-24 => new Date()

  //表单验证
  if (!req.body.title || !req.body.price || !req.body.time) {
    // res.status(400).send("表单数据不完整");
    res.json({
      code: "0001",
      msg: "表单数据不完整",
      data: null,
    });
    return;
  }
  // 插入数据库
  AccountModel.create({ ...req.body, time: moment(req.body.time).toDate() })
    .then((data) => {
      // res.render("success", { msg: "添加成功", url: "/account" });
      res.json({
        code: "0000",
        msg: "添加成功",
        data: data,
      });
    })
    .catch((err) => {
      if (err) {
        res.json({
          code: "0002",
          msg: "添加失败",
          data: null,
        });
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
router.get("/account/delete/:id",checkTokenMiddleware, (req, res) => {
  //删除数据
  AccountModel.deleteOne({ _id: req.params.id })
    .then((data) => {
      // res.render("success", { msg: "删除成功", url: "/account" });
      res.json({
        code: "0000",
        msg: "删除成功",
        data: data,
      });
    })
    .catch((err) => {
      if (err) {
        // res.status(500).send("删除失败");
        res.json({
          code: "0003",
          msg: "删除失败",
          data: null,
        });
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

//获取单个账单信息
router.get("/account/:id",checkTokenMiddleware, (req, res) => {
  //获取id
  let id = req.params.id;
  //查询数据
  AccountModel.findById(id)
    .then((data) => {
      // res.render("edit", { account: data });
      res.json({
        code: "0000",
        msg: "查询成功",
        data: data,
      });
    })
    .catch((err) => {
      if (err) {
        // res.status(500).send("查询失败");
        res.json({
          code: "0004",
          msg: "查询失败",
          data: null,
        });
      }
      return;
    });
});

//修改账单
router.patch("/account/:id",checkTokenMiddleware, (req, res) => {
  //获取id
  let id = req.params.id;
  //更新数据
  AccountModel.updateOne(
    { _id: id },
    { ...req.body, time: moment(req.body.time).toDate() }
  )
    .then((data) => {
      // res.render("success", { msg: "修改成功", url: "/account" });
      //再次查询数据，获取单条数据
      AccountModel.findById(id)
        .then((data) => {
          res.json({
            code: "0000",
            msg: "修改成功",
            data: data,
          });
        })
        .catch((err) => {
          if (err) {
            // res.status(500).send("查询失败");
            res.json({
              code: "0004",
              msg: "查询失败",
              data: null,
            });
          }
          return;
        });
    })
    .catch((err) => {
      if (err) {
        // res.status(500).send("修改失败");
        res.json({
          code: "0005",
          msg: "修改失败",
          data: null,
        });
      }
      return;
    });
});

// router.patch("/account/:id", (req, res) => {
//   let id = req.params.id;

//   // 使用Promise包装异步操作
//   const updateData = () => {
//     return new Promise((resolve, reject) => {
//       AccountModel.updateOne(
//         { _id: id },
//         { ...req.body, time: moment(req.body.time).toDate() }
//       )
//         .then(() => {
//           resolve();
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   };

//   const retrieveData = () => {
//     return new Promise((resolve, reject) => {
//       AccountModel.findById(id)
//         .then((data) => {
//           resolve(data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   };

//   updateData()
//     .then(() => {
//       return retrieveData();
//     })
//     .then((data) => {
//       res.json({
//         code: "0000",
//         msg: "修改成功",
//         data: data,
//       });
//     })
//     .catch((err) => {
//       if (err) {
//         res.json({
//           code: "0004",
//           msg: "查询失败",
//           data: null,
//         });
//       }
//     });
// });
module.exports = router;
