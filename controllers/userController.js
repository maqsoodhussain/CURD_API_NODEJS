// get all users list

const db = require("../config/db");

//Get all Users
const getUsers = async (req, res) => {
  try {
    const data = await db.query('SELECT * FROM users');
    if (!data) {
      return res.status(404).send({
        success: false,
        message: 'No Records Found'
      })
    }

    res.status(200).send({
      success: true,
      message: "All Users ",
      length: data[0].length,
      data: data[0]
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in getting All users API'
    })

  }
}

const getUserById = async (req, res) => {

  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(404).send({
        success: false,
        message: "Provide Id"
      })
    }

    const data = await db.query(`SELECT * FROM users where id=?`, [userId]);

    if (data[0].length === 0) {  // if we check only !data it is return array that is empty
      return res.status(404).send({
        success: false,
        message: 'No Records Found'
      })
    }

    res.status(200).send({
      success: true,
      data: data[0],
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in Get User by Id API',
      error
    })
  }
}


const createUser = async (req, res) => {
  try {
    const { name, email, phone, age } = req.body;
    if (!name || !email || !phone || !age) {
      return res.status(404).send({
        success: false,
        message: "Provide All Details"
      })
    }
    const [rows] = await db.query('SELECT * FROM USERS WHERE email=?', [email])

    if (rows.length >= 1) {
      return res.status(404).send({
        success: false,
        message: 'Data Already Inserted'
      })
    }
    const data = await db.query('INSERT INTO USERS (name,email,phone,age) VALUES (?,?,?,?)', [name, email, phone, age])
    if (!data) {
      return res.status(404).send({
        success: false,
        message: 'Error in Inserting the DATA'
      })
    }

    res.status(200).send({
      success: true,
      message: 'New Record Created',
      data
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error While Creating New User',
      error
    })
  }
}

const deleteById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(404).send({
        success: false,
        message: "Provide  Id"
      })
    }


    const [result] = await db.query('DELETE FROM users WHERE id=?', [userId]);
    console.log(result.affectedRows)

    if (result.affectedRows === 0) {  // if we check only !data it is return array that is empty
      return res.status(404).send({
        success: false,
        message: 'No Records Found'
      })
    } else {
      res.status(200).send({
        success: true,
        message: 'Record Deleted',
        result,
      })
    }


  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in Get User by Id API',
      error
    })
  }
}

const updateUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Provide email"
      });
    }

    const { name, phone, age } = req.body;

    // Check if at least one field is provided
    if (!name && !phone && !age) {
      return res.status(400).send({
        success: false,
        message: "Provide at least one field to update"
      });
    }

    // Build dynamic query if we dont know how many values are updated we are making array and insert email at the end 
    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push('name=?');
      values.push(name);
    }
    if (phone !== undefined) {
      fields.push('phone=?');
      values.push(phone);
    }
    if (age !== undefined) {
      fields.push('age=?');
      values.push(age);
    }

    values.push(email); // For WHERE clause
    console.log(values)
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE email=?`;

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).send({
        success: false,
        message: 'User not found or no changes'
      });
    }

    res.status(200).send({
      success: true,
      message: 'Record Updated',
      result
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
};

module.exports = { getUsers, getUserById, createUser, deleteById, updateUserByEmail }
