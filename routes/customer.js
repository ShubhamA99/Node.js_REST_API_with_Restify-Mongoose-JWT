const errors = require('restify-errors')
const Customer = require('../models/customerModel')

module.exports = server =>{
    server.get('/customers', (req,res,next)=>{
       Customer.find({}).then(cust=> {
        res.send(cust)
        next();
       }).catch((err)=>{
            return next(new errors.InvalidContentError(err))
       }) 
    })

    server.post("/customers",(req,res,next)=>{

        if(!req.is('application/json')){
            return next(new errors.InvalidContentError(err))
        }

        const {name,email,balance} = req.body

        const cust  = new Customer({
            name:name,
            email:email,
            balance:balance
        })

        cust.save().then(response =>{
            console.log(response);
            res.send(201);
            next();
        }).catch(err=>{
            return next(new errors.InvalidContentError(err))
        })

    })



    server.get('/customers/:id',(req,res,next)=>{
        Customer.findById(req.params.id).then(response=>{
            res.send(response);
            next();
        }).catch(err=>{
            return next(new errors.InvalidContentError(err))
        })
    })

    server.put('/customers/:id',(req,res,next)=>{
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError(err))
        }

        Customer.findByIdAndUpdate({_id:req.params.id},req.body)
        .then(response=>{res.send(200); next()})
        .catch(err=>{ return next(new errors.ResourceNotFoundError(`There is no customer with id of ${req.params.id}`))})
    })


    server.del('/customers/:id',(req,res,next)=>{
        Customer.findByIdAndDelete({_id:req.params.id}).then(response=>{
            res.send(204);
            next();
        }).catch(err=>{
            return next(
                new errors.ResourceNotFoundError(
                    `There is no Customer with id of ${req.params.id}`
                )
            )
        })
    })
}