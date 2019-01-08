var express = require('express');
var app = express();
var myPort=80;
const {getMongo} = require("./mymongo.js");
//var path = require('path');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('./public'));

var testarray=[];
var boughtItems=[];
var myuname="";
var myupass="";
var myLogFlag="";
var newLogin=[];
var myUserList=[];
var dupUser="";
var myLoggedUser="";

app.listen(myPort);
console.log("The server is running on port: "+myPort);

app.get('/',function(req,res){
    if (myLogFlag=="true"){
        res.sendFile(__dirname+'/indexLog.html');
    }else {
        res.sendFile(__dirname+'/index.html');
    }
});

app.get('/myLogOut',function(req,res){
    myLogFlag="";
    res.sendFile(__dirname+'/index.html');    
});

app.get('/addData',function(req,res){
    if (myLogFlag=="true"){
        res.sendFile(__dirname+'/addData.html');        
    } else{
        res.sendFile(__dirname+'/failedLogin.html');
    }

});

app.get('/newReg',function(req,res){
        res.sendFile(__dirname+'/newAcc.html');    
});

app.get('/viewData',function(req,res){
    //res.sendFile(__dirname+'/viewData.html');
    if (myLogFlag=="true"){
        res.render('viewData',{testarray,myLoggedUser});
    }else{
        res.sendFile(__dirname+'/failedLogin.html');
    }
    
});

app.get('/viewBuy',function(req,res){
    //res.sendFile(__dirname+'/viewData.html');
    if (myLogFlag=="true"){
        res.render('viewBuy',{boughtItems});
    }else{
        res.sendFile(__dirname+'/failedLogin.html');
    }
});

app.get('/viewBuyUsers',function(req,res){
    //res.sendFile(__dirname+'/viewData.html');
    if (myLogFlag=="true"){
        res.render('viewBuyUsers',{boughtItems,myLoggedUser});
    }else{
        res.sendFile(__dirname+'/failedLogin.html');
    }
});

app.get('/viewAfterLogin',function(req,res){
    //res.sendFile(__dirname+'/viewData.html');
    if (myLogFlag=="true"){
        res.sendFile(__dirname+'/indexLog.html');
    } else{
        res.sendFile(__dirname+'/failedLogin.html');
    }
    
});




app.post("/post-feedback", function(req, res) {
//    console.log(req.body.user.name);
//    console.log(req.body.user.email);
//    console.log(req.body.user.comment);

/*    myName=req.body.user.name;
    myEmail=req.body.user.email;
    myComment=req.body.user.comment;
    myarray.push(req.body.user.name);
    myarray.push(req.body.user.email);
    myarray.push(req.body.user.comment);
*/
    testarray.push(req.body.user);
    console.log(testarray);
    
    //res.send({ status: 'SUCCESS' });
    //alert("Data has been saved");
    //res.sendFile(__dirname + '/addData');
    res.redirect('/addData');
});

app.post("/main-login", async function(req, res){
    
    dupUser="";

    myuname=req.body.user.loginid;
    myupass=req.body.user.loginpass;

    const conn = await getMongo();
    const db = conn.db("nodejsecom");
    console.log(conn);
    const userCollection = db.collection("UserList");
    const user = await userCollection.findOne({
        username:myuname,
        userpass:myupass

    });

    const userAll = await userCollection.find(
       // username:myuname,
       // userpass:myupass
    ).toArray();    

    //console.log(userAll);

    //for(i=0;i<userAll.length;i++){
    //    console.log(userAll[i].username);
    //}

    if(!user){
        res.sendFile(__dirname+'/failedLogin.html');        
    }else{
        myLogFlag="true";
        myLoggedUser=req.body.user.loginid;
        //console.log(user);
        res.redirect('/');        
    }

/*    for(i=0;i<myUserList.length;i++){
        if((myUserList[i].newid==req.body.user.loginid) && (myUserList[i].newpass==req.body.user.loginpass)){
            dupUser="true";  
        }
    }    

    if (dupUser=="true"){
        //res.sendFile(__dirname+'/indexLog.html');        
        myLogFlag="true";
        myLoggedUser=req.body.user.loginid;
        res.redirect('/');
    } else {
        res.sendFile(__dirname+'/failedLogin.html');
    } */

});

app.post("/buyProduct", function(req, res) {

        //testarray.push(req.body.user);
        //console.log(req.body.user);
        boughtItems.push(req.body.user);
        console.log(boughtItems);
        
        //res.send({ status: 'SUCCESS' });
        //alert("Data has been saved");
        //res.sendFile(__dirname + '/addData');
        res.redirect('/viewData');
});

app.post("/createAcc", async function(req, res){
    
    const conn = await getMongo();
    const db = conn.db("nodejsecom");
    console.log(conn);
    const userCollection = db.collection("UserList")

    const myDupUser = await userCollection.findOne({
        username:myuname
    });

    if (!myDupUser) {
        const user = await userCollection.insert({
            username:req.body.user.newid,
            userpass:req.body.user.newpass
        });
        res.redirect('/');
    } else {
        res.redirect('/newReg');
    }

 /*   newLogin=[];
    //newLogin.push(req.body.user);
    console.log("old data");
    console.log(myUserList);
    if(myUserList.length==0){
        myUserList.push(req.body.user);
        console.log("came to 1");
        //dupUser="true";
        res.redirect('/');      
    }else {            
        for(i=0;i<myUserList.length;i++){
            if(myUserList[i].newid==req.body.user.newid){
                dupUser="true";  
                console.log("came to 2");                              
            }
        }
        if(dupUser=="true"){        
            console.log("came to 3");
            dupUser="";
            res.redirect('/newReg');
        }else{
            console.log("came to 4");
            myUserList.push(req.body.user);
            res.redirect('/');
        }
    }
 */   
    res.redirect('/');
    console.log();
    console.log();
    console.log();
    console.log("New data");
    console.log(myUserList);
});