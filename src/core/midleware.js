const { RequestValidator } = require('fastest-express-validator');

const PASSWORD = process.env.PASSWORD;

module.exports = {
    auth(req, res, next) {
        const password = req.headers['x-password'] || req.query['password'] || req.body['password'];

        if (password == PASSWORD) {
            return next();
        }

        res.status(403).json({
            status: false,
            code: 403,
            i18n: "FORBIDDEN",
            message: "Forbidden"
        });
    },
    validator(params = {}) {
        return RequestValidator({
            body: params
        }, (err, req, res, next) => {
            if (err) {
                return res.status(401).json({
                    status: false,
                    code: 401,
                    i18n: 'BAD_DATA',
                    message: 'Bad data',
                    data: err,
                });
            }

            next();
        })
    }
}