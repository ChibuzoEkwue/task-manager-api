const {MongoClient ,ObjectID}= require('mongodb');

const connectionURL ='mongodb://127.0.0.1:27017';

const dbName ='task-manager';
// const id = new ObjectID;
// console.log(id)
// console.log(id.getTimestamp().getTime())
MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
     if(error){
    return console.log('Unable to connect')
     }

     const db = client.db(dbName);
    // db.collection('user').findOne({ _id: new ObjectID('5e84a10e38a27c0788460063')},(error,user)=>{
    //     if (error) {
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(user)
    // })
    // db.collection('user').find({age:25} ).toArray((error,users)=>{
    //    console.log(users)
    // })
    // db.collection('user').find({ age: 25 }).count((error, users) => {
    //     console.log(users)
    // })
    // db.collection('new task').findOne({ _id: new ObjectID('5e84aba08233ee2494594409')},(error,task)=>{
    //     console.log(task)
    // })
    // db.collection('new task').find({ completed: false }).toArray((error,task)=>{
    //     console.log(task)
    // })
//    db.collection('user').updateOne({ _id: new ObjectID('5e84a10e38a27c0788460063')},{
//         $inc:{
//             age: 1
//         }
//     }).then(()=>{

//     }).catch((err)=>{
//         console.log(err)
//     })
    db.collection('new task').updateMany({completed:false},{
        $set:{
            completed:true
        }
    }).then((result)=>{
          console.log(result)
    })
    .catch((err)=>{
           console.log(err)
    })
})