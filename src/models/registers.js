const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const employeeSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    conformpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
}) 
//middleware
employeeSchema.methods.generateAuthToken=async function(){

    try {
        console.log(this._id);
        const token=jwt.sign({_id:this._id.toString()},"mynameisurvashiiamyoutuberiamnodejsdeveloper");
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        res.send(`the error part ${error}`);
        console.log(`the error part ${error}`);
        
    }

}
employeeSchema.pre("save",async function (next) {
    // const passwordHash=await bcrypt.hash(password,10);
    if(this.isModified("password")){
        console.log(`current pass is ${this.password}`);
        this.password=await bcrypt.hash(this.password,10);
        console.log(`current pass after hash is ${this.password}`);
        this.conformpassword=await bcrypt.hash(this.conformpassword,10);
    }
    next();   
})

const Register=new mongoose.model("Register",employeeSchema)
//first argument is collection name and it's follow pascal case and it should be in singular form

module.exports=Register;