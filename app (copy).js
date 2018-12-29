var express = require('express');
var app = express();
var path = require('path');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

var myName;
var myEmail;
var myComment;
var myarray=[];
var testarray=[];

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.get('/addData',function(req,res){
    res.sendFile(__dirname+'/addData.html');
});

app.get('/viewData',function(req,res){
    //res.sendFile(__dirname+'/viewData.html');
    res.render('viewData',{testarray});
});

app.use(express.static('./public'));


app.listen(3000);

app.post("/post-feedback", function(req, res) {
    console.log(req.body.user.name);
    console.log(req.body.user.email);
    console.log(req.body.user.comment);

    myName=req.body.user.name;
    myEmail=req.body.user.email;
    myComment=req.body.user.comment;
    myarray.push(req.body.user.name);
    myarray.push(req.body.user.email);
    myarray.push(req.body.user.comment);

    testarray.push(req.body.user);
    console.log(testarray[0]);
    console.log(testarray[1]);
    
    //res.send({ status: 'SUCCESS' });
    //alert("Data has been saved");
    //res.sendFile(__dirname + '/addData');
    res.redirect('/addData');
});