const bcrypt = require('bcrypt');
const User = require('../model/User');

 /*
        lookahead assertion that checks if it contains at least one lowercase and uppercase character.
         one digit and one special charcater. specifiy the characters must be inside the set enclosed in [] and min 6 characters
*/
const regEx =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

// hash the user's password before storing it in the database this will be done in the controller generate salt and hash using becrypt
const signUpUser = async (req,res) => {
    const {user_id, username, password, role} = req.body();
    try{
        // handle password validation
        if(validatePassword(password)){
            if(role == "member" || role == "libarian"){
                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const currentUser = new User(user_id,username,password,role)
                const result = User.registerUser(currentUser)
                if(result != null){
                    return res.status(201).json({ message: "User created successfully" });
                }
            }
            else{
                return res.status(401).json({message: "Invalid role entered"})
            }
        }
        else{
            return res.status(401).json({message: "Invalid password entered. Password should contain an uppercase and lowercase character, a digit and a special character and should be at least 6 characters."})
        }
        



    }
    catch(error){
        console.error(error);
        res.status(500).send('Unable to create a new user')
    }

}

function validatePassword(password){
    return regEx.test(password)
}