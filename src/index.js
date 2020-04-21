const express = require('express');
require('./db/mongoose')

const app = express();
app.use(express.json())
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const port = process.env.PORT 

app.use(userRouter)

app.use(taskRouter)

app.listen(port, () => {
  console.log(`Server is running at ${port}`)
})

// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async ()=>{
//   // const task = await Task.findById('5e91df0140239137e4d3c7bb')
//   // await task.populate('owner').execPopulate()
//   // console.log(task.owner)
//   const user = await User.findById('5e945f70e4ddfe3bcc6c8d71')
//   await user.populate('task').execPopulate()
//   console.log(user.task)
// }
// main()
