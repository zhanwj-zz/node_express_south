var express = require('express');
var multiparty = require('multiparty');
var querystring = require("querystring");
var url = require('url');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {    
    res.render('index');
})
//给编辑器提供的上传图片的接口
app.post('/imgupload',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir='public/upload';  /*设置图片上传的路径*/
    form.parse(req, function(err, fields, files) {

        var path=files.file[0].path;

        path=path.substring(6).replace(/\\/g,'/')

        res.json({"success":"true","path":path}) 

    });
})

server.listen(3000);  

//写socket.io的服务
io.on('connection', function (socket) {
    var roomId = querystring.parse(socket.request.url.split("?")[1]).roomid;
    /*获取房间号*/
    socket.join(roomId);  /*加入房间/加入分组*/
    socket.on('toServer', function (data) {
        console.log(data);
        //通知分组内的用户不包括自己
        socket.broadcast.to(roomId).emit('toClient', {
            title:data.title,
            url:data.url,
        }); 
    })
});





