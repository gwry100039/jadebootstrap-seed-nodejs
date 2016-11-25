var CASAuthentication = require('r-cas-authentication');
var url = require('url')

var cas_url = 'http://passport.oa.cqrcb.com/cas-oa';
var service_url = 'http://10.181.136.243:3000/';

exports = module.exports = {}

exports.cas = new CASAuthentication({
    cas_url             : cas_url,
    // cas_internal_url    : 'https://my-cas-host.service.com/cas',
    service_url         : service_url,
    cas_port            : 80,
    cas_version         : 'saml1.1',
    renew               : false,
    is_dev_mode         : false,
    dev_mode_user       : '',
    dev_mode_info       : {},
    session_name        : 'cas_user',
    session_info        : 'cas_userinfo',
    destroy_session     : false
});

exports.authorize = function (req, res, next) {
	if (!req.session.cas_user) {
		res.redirect('/');
	}
	else {
        req.session.username = req.session.cas_user;
        res.locals.username = req.session.username;
		next();
	}
}

exports.logout = exports.cas.logout