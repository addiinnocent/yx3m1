const mongoose = require('mongoose');
const twofactor = require('node-2fa');
const { secret, qr } = twofactor.generateSecret({name: 'yx3m1', account: 'admin'});

const Schema = mongoose.Schema;
const ConfigSchema = new Schema({
	api_key: {type: String},
	api_version: {type: Number},

	maintenance: {type: Boolean},
	twofactor:  {type: Boolean},
	admin_user: {type: String},
	admin_pass: {type: String},
	admin_secret: {type: String},
	admin_qr: {type: String},
	useragent_protect: {type: String},

	stripe_active: {type: Boolean},
	stripe_methods: {type: Array},
	stripe_publickey: {type: String},
	stripe_secretkey: {type: String},
	paypal_active: {type: Boolean},
	paypal_client: {type: String},
	paypal_secret: {type: String},

	sendmail: {type: Boolean, default: false},
	mail_from: {type: String},
	mail_host: {type: String},
	mail_port: {type: Number},
	mail_secure: {type: Boolean},
	mail_user: {type: String},
	mail_pass: {type: String},

	schedule_email: {type: String},
	schedule_daily: {type: Boolean},
	schedule_weekly: {type: Boolean},
	schedule_monthly: {type: Boolean},

	countries: {type: Array}
});
ConfigSchema.pre('save', async function(next) {
  if (this.isModified('twofactor')) {
		if (this.twofactor == true) {
			this.admin_secret = secret;
			this.admin_qr = qr;
		}
	} next();
});

const Config = mongoose.model('Config', ConfigSchema);

(async () => {
	try {
		var config = await Config.findOne({});
		if (!config) {
			config = Config.create({
				api_key: process.env.API_KEY,
				api_version: process.env.API_VERSION,

				maintenance: process.env.MAINTENANCE,
				twofactor: process.env.TWOFACTOR,
				admin_user: process.env.ADMIN_USER,
				admin_pass: process.env.ADMIN_PASS,
				admin_secret: process.env.ADMIN_SECRET,
				useragent_protect: process.env.USERAGENT_PROTECT,

				currency: process.env.CURRENCY,
				stripe_methods: process.env.STRIPE_METHODS.split(','),
				stripe_publickey: process.env.STRIPE_PUBLICKEY,
				stripe_secretkey: process.env.STRIPE_SECRETKEY,
				currency: process.env.CURRENCY,
				paypal_client: process.env.PAYPAL_CLIENT_ID,
				paypal_secret: process.env.PAYPAL_CLIENT_SECRET,
				sendmail: process.env.SENDMAIL,

				mail_from: process.env.MAIL_FROM,
				mail_host: process.env.MAIL_HOST,
				mail_port: process.env.MAIL_PORT,
				mail_secure: JSON.parse(process.env.MAIL_SECURE),
				mail_user: process.env.MAIL_USER,
				mail_pass: process.env.MAIL_PASS,

				schedule_email: process.env.SCHEDULE_EMAIL,
				schedule_daily: process.env.SCHEDULE_DAILY,
				schedule_weekly: process.env.SCHEDULE_WEEKLY,
				schedule_monthly: process.env.SCHEDULE_WEEKLY,

				countries: process.env.COUNTRIES.split(','),
			});
			console.log('Config initialized');
		}
	} catch(e) {
		console.error(e);
	}
})();

const config = async () => {
	return await Config.findOne({});
}


module.exports = { Config, config };
