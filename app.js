var express = require('express');
var app = express();
var myPort=80;
const {getMongo} = require("./mymongo.js");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('./public'));

var testarray;
var boughtItems;
var myuname="";
var myupass="";
var myLogFlag="";
var myLoggedUser="";
var customMsg="";

app.listen(myPort);
console.log("The server is running on port: "+myPort);

app.get('/', async function(req,res){
    //if (myLogFlag=="true"){
        
        const conn = await getMongo();
        const db = conn.db("nodejsecom");
        console.log(conn);
        const userCollection = db.collection("BoughtList");
        const testArr = db.collection("ProductList");
            
        boughtItems = await userCollection.find().toArray();
        testarray = await testArr.find().toArray();

        console.log(testarray);

        res.render('index',{myLoggedUser,testarray,myLogFlag,myLoggedUser});
        //res.render('indexLog',{myLoggedUser});
    //}else {
        //res.sendFile(__dirname+'/index.html');
    //    res.render('index',{myLoggedUser,testarray,myLogFlag,myLoggedUser});
   // }
});

app.get('/myLogOut',function(req,res){
    myLogFlag="";myLoggedUser="";
    //res.sendFile(__dirname+'/index.html');
    res.redirect('/');    
});

app.get('/addData',function(req,res){
    if (myLogFlag=="true"){
        res.render('addData',{myLogFlag,myLoggedUser});        
    } else{
        res.sendFile(__dirname+'/failedLogin.html');
    }

});

app.get('/newReg',function(req,res){
        res.render('newAcc',{customMsg});
        //res.sendFile(__dirname+'/newAcc.html');    
});

app.get('/viewData', async function(req,res){
    if (myLogFlag=="true"){

        const conn = await getMongo();
        const db = conn.db("nodejsecom");
        console.log(conn);
        const userCollection = db.collection("ProductList");
    
        //const myDupUser = await userCollection.findOne({        username:myuname    });
        //res.redirect('/');
            
        testarray = await userCollection.find().toArray();
        console.log(testarray);
            
        res.render('viewData',{testarray,myLoggedUser});
    }else{
        res.sendFile(__dirname+'/failedLogin.html');
    }
    
});

app.get('/viewBuy', async function(req,res){
    if (myLogFlag=="true"){
        const conn = await getMongo();
        const db = conn.db("nodejsecom");
        console.log(conn);
        const userCollection = db.collection("BoughtList");
        const testArr = db.collection("ProductList");

    
        //const myDupUser = await userCollection.findOne({        username:myuname    });
        //res.redirect('/');
            
        boughtItems = await userCollection.find().toArray();
        testarray = await testArr.find().toArray();


        console.log(boughtItems);


        res.render('viewBuy',{boughtItems,myLogFlag,myLoggedUser});
    }else{
        res.sendFile(__dirname+'/failedLogin.html');
    }
});

app.get('/viewBuyUsers', async function(req,res){
    if (myLogFlag=="true"){
        
        const conn = await getMongo();
        const db = conn.db("nodejsecom");
        console.log(conn);
        const userCollection = db.collection("BoughtList");
        const testArr = db.collection("ProductList");

    
        //const myDupUser = await userCollection.findOne({        username:myuname    });
        //res.redirect('/');
            
        boughtItems = await userCollection.find().toArray();
        testarray = await testArr.find().toArray();

        res.render('viewBuyUsers',{boughtItems,myLoggedUser});
    }else{
        res.sendFile(__dirname+'/failedLogin.html');
    }
});

app.get('/myLogin', async function(req,res){
        res.render('myLogin');
});

app.get('/viewAfterLogin', function(req,res){
    if (myLogFlag=="true"){
        res.sendFile(__dirname+'/indexLog.html');
    } else{
        res.sendFile(__dirname+'/failedLogin.html');
    }
    
});




app.post("/post-feedback", async function(req, res) {

    //testarray.push(req.body.user);

    const conn = await getMongo();
    const db = conn.db("nodejsecom");
    console.log(conn);
    const userCollection = db.collection("ProductList");

    //const myDupUser = await userCollection.findOne({        username:myuname    });

        const user = await userCollection.insert({
            name:req.body.user.name,
            type:req.body.user.type,
            size:req.body.user.size,
            uprice:req.body.user.uprice,
            descript:req.body.user.descript
        });
        //res.redirect('/');
        
        //testarray = await userCollection.find().toArray();    
        

    console.log(testarray);
    
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

    const userAll = await userCollection.find().toArray();    

    if(!user){
        res.sendFile(__dirname+'/failedLogin.html');        
    }else{
        myLogFlag="true";
        myLoggedUser=req.body.user.loginid;
        res.redirect('/');        
    }

});

app.post("/buyProduct", async function(req, res) {

        //boughtItems.push(req.body.user);
        const conn = await getMongo();
        const db = conn.db("nodejsecom");
        console.log(conn);
        const userCollection = db.collection("BoughtList");
    
        //const myDupUser = await userCollection.findOne({        username:myuname    });
    
            const user = await userCollection.insert({
                productName:req.body.user.productName,
                productType:req.body.user.productType,
                productSize:req.body.user.productSize,
                productPrice:req.body.user.productPrice,
                productID:req.body.user.productID,
                myUser:req.body.user.myUser,
                productUnit:req.body.user.productUnit
            });


//        console.log(boughtItems);
        
        res.redirect('/viewData');
});

app.post("/createAcc", async function(req, res){
    
    const conn = await getMongo();
    const db = conn.db("nodejsecom");
    console.log(conn);
    const userCollection = db.collection("UserList")

    const myDupUser = await userCollection.findOne({
        username:req.body.user.newid
    });

    if (!myDupUser) {
        const user = await userCollection.insert({
            username:req.body.user.newid,
            userpass:req.body.user.newpass
        });
        res.redirect('/');
    } else {
        customMsg="Username already taken";
        res.render('newAcc',{customMsg});
        //res.redirect('/newReg');
    }
    res.redirect('/');    
});