var CASAuthentication = require('r-cas-authentication');

var cas = new CASAuthentication({
    cas_url             : 'http://passport.oa.cqrcb.com/cas-oa',
    // cas_internal_url    : 'https://my-cas-host.service.com/cas',
    service_url         : 'http://10.181.136.243:3000/',
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

var authorize = function (req, res, next) {
	if (!req.session.user_id) {
		res.redirect('/login');
	}
	else {
		next();
	}
}

module.exports = {
	authorize : authorize,
	cas : cas
}