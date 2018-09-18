var express = require('express');
var app = express();

// 模板处理
var  ejs = require('ejs');
var path = require('path');
app.set('views', path.join(__dirname, '/view'));
app.set('view engine', 'html');
app.engine('html',ejs.renderFile)


app.get('/a', function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.render('index.html',{});
});

// 文件上传中间件
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
app.use(multipart({uploadDir:'/nodeUpload' }))

// 文件处理
const fs= require("fs");
app.post('/api/upload',multipartMiddleware,function (req, res) {  
  let filePath = req.files.file.path;
  let fileName = req.files.file.name;
  fs.readdir('/nodeUpload',(err,data)=>{
    if (err){
      console.log(err);
    }else{
      data.forEach((item)=>{
        if(item==fileName){
          res.send({
            message:'文件已存在'
          })
        }
      })
      fs.rename(filePath,fileName,(err)=>{
        if (err) throw err
        res.send({
          message:'成功'
        })
      })
    }
  })
});

app.get('/api/download',function(req,res){
  var url = 'G:/nodeUpload/水电.txt';
  url = path.resolve(url);
  console.log('Download file: %s', url);
  res.download(url);
})

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('', host, port);
});