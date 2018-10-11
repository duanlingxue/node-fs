var express = require('express');
var app = express();
var path = require('path')
var filePath = path.resolve();
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
  let fileSize = req.files.file.size;
  if(!fileSize){
    res.send({
      message:'文件无内容'
    })
    return
  }
  fs.readdir('/nodeUpload',(err,data)=>{
    if (err){
      console.error(err);
    }else{
      data.forEach((item)=>{
        if(item==fileName){
          res.send({
            message:'文件已存在'
          })
        }
      })
      fs.readFile(filePath, 'utf8', function(err, data){
        console.log(data);  
    });
      fs.rename(filePath,fileName,(err)=>{
        if (err) throw err
        res.send({
          message:'成功'
        })
      })
    }
  })
});

// 文件夹内文件目录
let filearr = []
app.get('/api/getdir',function(req,res){
  let files = fs.readdirSync(filePath);
  files.forEach((file)=>{
    let stats = fs.statSync(path.join(filePath,file)) 
    if(stats.isFile()){
      filearr.push(path.join(filePath,file));
    }
  })
  writeFile(filearr)
  res.send({
    data:filearr,
    code:200,
    message:'成功'
  })
})
app.get('/api/download',function(req,res){
  var url = 'G:/nodeUpload/水电.txt';
  url = path.resolve(url);
  console.log('Download file: %s', url);
  res.download(url);
})


//获取后缀名
function getdir(url){
  var arr = url.split('.');
  var len = arr.length;
  return arr[len-1];
}

function writeFile(data){
  var data = data.join("\r\n")
  fs.writeFile(path.join(filePath,'filelist.txt'),data,(err)=>{
    if(err)console.log(err)
    console.log('写入成功')
  })
}

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('欢迎来到', host, port);
});