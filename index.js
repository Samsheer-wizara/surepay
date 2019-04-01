const Hapi = require('hapi');
const mongoose = require('mongoose');

const registerData = require('./register');
const server = Hapi.server({
    port : 3000,
    host : 'localhost'
});

server.route({
    method: 'GET',
    path: '/register',
    handler: (request,h)=>{
        return registerData.find()
        .exec()
        .then((doc)=>{
            return doc;
        })
        .catch(err=>{
            return err;
        });
    }
});

server.route({
    method: 'GET',
    path: '/register/{id}',
    handler: (request,h)=>{
        const id = request.params.id;
        return registerData.findById(id)
        .exec()
        .then((doc)=>{
            return doc;
        })
        .catch(err=>{
            return err;
        });
    }
});


server.route({
    method: 'POST',
    path: '/register',
    handler: (request,h)=>{
        const registerdata = new registerData({
            _id : new mongoose.Types.ObjectId,
            name : request.payload.name,
            price : request.payload.price
        });

        return registerdata.save()
        .then((doc)=>{
            return doc;
        })
        .catch(err=>{
            return err;
        });
    }
});

server.route({
    method: 'DELETE',
    path: '/register/{id}',
    handler: (request,h)=>{
        const id = request.params.id;
        return registerData.deleteOne({_id : id })
        .exec()
        .then((doc)=>{
            return doc;
        })
        .catch((err)=>{
            return err
        });
    }
});

server.route({
    method: 'PATCH',
    path: '/register/{id}',
    handler: (request,h)=>{
        const id = request.params.id;
        const updateOps = {};
    
        for(const ops of request.payload){
            updateOps[ops.propName] = ops.value;
        }

        return registerData.update({_id : id},{$set: updateOps})
        .exec()
        .then((doc)=>{
            return doc;
        })
        .catch((err)=>{
            return err
        });
    }
});

const init = async() =>{
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    mongoose.connect('mongodb://localhost:27017/MEANStackDB',{useNewUrlParser : true},(err)=>{
        if(!err){
            console.log('Mongo Db is connected');
        }
        else{
            console.log('Database error'+ JSON.stringify(err,undefined,2));
        }
    });
}

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();