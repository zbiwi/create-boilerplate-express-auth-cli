export const GoogleControllerTemplate = (userFields) => {
    return `
        export const googleLogin = (req, res) => {
            res.send('<a href="/auth/google">Se connecter avec Google</a>');
        };

        export const googleCallback = (req, res) => {
            // You have to put the right redirect in your case
            res.redirect('/dashboard');
        };

        export const googleLogout = (req, res) => {
            req.logout(function(err) {
                if (err) { return next(err); }
                req.session.destroy(() => {
                    res.clearCookie("connect.sid");
                    res.redirect("/");
                });
            });
        }
    `;
};
