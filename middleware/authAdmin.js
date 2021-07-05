const User = require("../models/User");

const adminEmails = ['nishthaioc@gmail.com'];

const isAdmin = (req, res) => {
    const user = res.locals.user;
    if (user) {
        const currentEmail = user.email;
        let a = 0;
        adminEmails.forEach((email) => {
            if (email == currentEmail) {
                a = 1;
            }
        })
        if (a == 1) {
            return true;
        }
        
    }
    return false;

}

const reqAdminAuth = (req, res, next) => {
    const user = res.locals.user;
    console.log("user = ", user);
    if (isAdmin(req, res)) next();
    else res.redirect('error');
    // if (user) {
    //     const currentEmail = user.email;
    //     let a = 0;
    //     adminEmails.forEach((email) => {
    //         if (email == currentEmail) {
    //             a = 1;
    //         }
    //     })
    //     if (a == 1) {
    //         next();
    //     }
    //     else {
    //         res.redirect('/error');
    //         next();

    //     }
    // }
    // else {   
    //     res.redirect('/error');
    //     next();
        
    // }
    
}

module.exports = {reqAdminAuth, isAdmin};
