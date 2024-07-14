const Account = require("../model/Account");

const getAccountByEmail = async (req, res) => {
    const email = req.params.email;
    try {
        const account = await Account.getAccountByEmail(email);
        if (!account) {
            return res.status(404).send("Account not found");
        }
        res.json(account);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving account")
    }
};

module.exports = {
    getAccountByEmail
};