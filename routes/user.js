const errors = require('restify-errors');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const auth  = require('../auth')
const jwt = require('jsonwebtoken')
const config = require('../config')


module.exports = server =>{
        server.post('/register',(req , res,next)=>{
            const{email,password}  = req.body;

            const user = new User({
                email:email,
                password:password
            })


            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(user.password,salt, async  (err,hash)=>{
                    //Hash paswword
                    user.password = hash;
                    try{
                        const newUser = await user.save();
                        res.send(201);
                        next();
                    }catch(err){
                        return next(new errors.InternalError(err.message ))
                    }
                })
            })
        })


        //Auth User

        server.post('/auth',(req,res,next)=>{
            console.log(req.body);
            const {email,password} = req.body

            auth.authenticate(email,password).then(response=>{
                
                //create JWT
                const token = jwt.sign(response.toJSON(),config.JWT_SECRET,{
                    expiresIn:'15m'
                });

                const {iat,exp} = jwt.decode(token);

                res.send({iat,exp,token})

                next()
            }).catch(err=>{
                return next(new errors.UnauthorizedError(err))
            })


        })
}