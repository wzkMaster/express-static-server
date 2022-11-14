const express = require('express');
const ejs = require('ejs')
const app = express();

// 配置模板引擎
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// 读取public文件夹内容
const fs = require('fs');
const path = require('path');

const base = './public/极客时间';
const dirs = fs.readdirSync(base);
const tree = {};
for (let dir of dirs.slice(1)) {
  tree[dir] = fs.readdirSync(path.join(__dirname, base, dir)).slice(1).map(f => {
    const stat = fs.lstatSync(path.join(__dirname, base, dir, f));
    if (stat.isDirectory()) {
      return { [f]: fs.readdirSync(path.join(__dirname, base, dir, f)) };
    } else {
      return f;
    }
  });
}
// 如果在环境变量内, 设定了程序运行端口，则使用环境变量设定的端口号, 否则使用3000端口
app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

// 匹配根路由 / (如果不特别指明返回的状态码, 则默认返回200)
app.get('/', function (req, res) {
  res.render("index.html", {
    names: dirs.slice(1),
    tree
  });
});

// 监听服务端口, 保证程序不会退出
app.listen(app.get('port'), function () {
  console.log('server is on http://localhost:' + app.get('port'));
});