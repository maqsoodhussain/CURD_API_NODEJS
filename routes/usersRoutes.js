const express = require('express')
const { getUsers,getUserById,createUser,deleteById ,updateUserByEmail} = require('../controllers/userController')
const router = express.Router()


//Get all users
router.get('/getAll',getUsers)

//Get uses by id
router.get('/get/:id',getUserById)


//create new user
router.post('/create',createUser)


router.get('/delete/:id',deleteById)

router.put('/update/:email',updateUserByEmail)

module.exports = router