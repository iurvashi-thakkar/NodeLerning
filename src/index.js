const express= require("express");
const path=require("path");
const hbs=require("hbs");
const bcrypt=require("bcryptjs")
const app=express();

require("./db/conn")
const Register=require("./models/registers")
const port=process.env.PORT || 3000;

app.use('/css',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/css")));
app.use('/js',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/js")));
app.use('/jq',express.static(path.join(__dirname,"../node_modules/jquery/dist")));

const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partial_path=path.join(__dirname,"../templates/partials");
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(static_path))

app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partial_path);

app.get("/",(req,res)=>{
    res.render("Home");
});

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/register",async(req,res)=>{
    try{
        const password=req.body.password;
        const conformpassword=req.body.conformpassword;
        if(password===conformpassword){
            const registerEmployee=new Register({
                email:req.body.email,
                password:req.body.password,
                conformpassword:req.body.conformpassword
            })
        console.log(registerEmployee);

            //password hashing 
        const token=await registerEmployee.generateAuthToken(); 
        res.cookie("jwt",token,{
            expires:new Date(Date.now+3000),
            httpOnly:true
        })
        console.log(cookie);   

        const registered=await registerEmployee.save();
        
        res.status(201).render("Home");
        }else{
            res.send("Password not match");
        }

    }catch(error){
        res.status(400).send(error);
    }


})


app.post("/login",async(req,res)=>{
    try{
        const password=req.body.password;
        const email=req.body.email;

        const useremail=await Register.findOne({email:email});

        const ismatch=await bcrypt.compare(password,useremail.password);
         
        if(ismatch){
            res.status(200).render("Home");
        }else{
            res.send("Invalid Login Details")
        }  
    }catch(error){
        res.status(400).send("Invalid Login Details");
    }
})

// here temporary learning of bcrypt js
// {
// const bcrypt=require("bcryptjs");
// const securePassword=async(password)=>{

//     const passwordHash=await bcrypt.hash(password,10);
//     console.log(passwordHash);

//     const passwordmatch=await bcrypt.compare(password,passwordHash);
//     console.log(passwordmatch);
// }

// securePassword("thapa123");}

//practice of jsonwebtoken
// {const jwt=require("jsonwebtoken");
// const createToken=async()=>{
//     const token=await jwt.sign({_id:"628e2f7d49839af0cc61d1f0"},"mycbiahaoenbcierpowheucbanjwndskncnianwhwnciiebca");
//     expiresIn:"2 minutes"
//     console.log(token);

//     const userver=jwt.verify(token,"mycbiahaoenbcierpowheucbanjwndskncnianwhwnciiebca");
//     console.log(userver);
// }
// createToken();}
app.listen(port,()=>{
    console.log("server is running at "+port);
})

