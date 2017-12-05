app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if ( email && password ) {
        Users.findOne({
            where: {
                email: req.body.email
            }
        })
        .then((user) => {
            if (user) {
                const hash = user.password;
                bcrypt.compare(password,hash)
                .then ((result) => {
                    if (!result) {
                        res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
                        return
                    } else {
                        req.session.user = user;
                    }
                })
                .then((result) => {
                    console.log('the result')
                    console.log(result)
                    res.redirect('/profile');
                })
            } else {
                res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
            }
        })
    } else {
        res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
    }
});
