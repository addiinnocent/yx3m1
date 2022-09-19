const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ConfigSchema = new Schema({
	api: {
		api_key: {type: String},
		api_version: {type: Number},
	},
	admin: {
		maintenance: {type: Boolean},
		useragent_protect: {type: String},
		admin_user: {type: String},
		admin_pass: {type: String},
	},
	stripe: {
		stripe_active: {type: Boolean},
		stripe_methods: {type: Array},
		stripe_publickey: {type: String},
		stripe_secretkey: {type: String},
	},
	paypal: {
		paypal_active: {type: Boolean},
		paypal_client: {type: String},
		paypal_secret: {type: String},
	},
	mail: {
		sendmail: {type: Boolean, default: false},
		mail_from: {type: String},
		mail_host: {type: String},
		mail_port: {type: Number},
		mail_secure: {type: Boolean},
		mail_user: {type: String},
		mail_pass: {type: String},
	},
	schedules: {
		schedule_email: {type: String},
		schedule_daily: {type: Boolean},
		schedule_weekly: {type: Boolean},
		schedule_monthly: {type: Boolean},
	},
	countries: {type: Array}
});
const Config = mongoose.model('Config', ConfigSchema);
const config = async () => {
	return await Config.findOne({});
}

(async () => {
	try {
		var config = await Config.findOne({});
		if (!config) {
			config = Config.create({
				api: {
					api_key: process.env.API_KEY,
					api_version: process.env.API_VERSION,
				},
				admin: {
					maintenance: process.env.MAINTENANCE,
					useragent_protect: process.env.USERAGENT_PROTECT,
					admin_user: process.env.ADMIN_USER,
					admin_pass: process.env.ADMIN_PASS,
				},
				stripe: {
					currency: process.env.CURRENCY,
					stripe_methods: process.env.STRIPE_METHODS.split(','),
					stripe_publickey: process.env.STRIPE_PUBLICKEY,
					stripe_secretkey: process.env.STRIPE_SECRETKEY,

				},
				paypal: {
					currency: process.env.CURRENCY,
					paypal_client: process.env.PAYPAL_CLIENT_ID,
					paypal_secret: process.env.PAYPAL_CLIENT_SECRET,
				},
				mail: {
					sendmail: process.env.SENDMAIL,
					mail_from: process.env.MAIL_FROM,
					mail_host: process.env.MAIL_HOST,
					mail_port: process.env.MAIL_PORT,
					mail_secure: JSON.parse(process.env.MAIL_SECURE),
					mail_user: process.env.MAIL_USER,
					mail_pass: process.env.MAIL_PASS,
				},
				schedules: {
					schedule_email: process.env.SCHEDULE_EMAIL,
					schedule_daily: process.env.SCHEDULE_DAILY,
					schedule_weekly: process.env.SCHEDULE_WEEKLY,
					schedule_monthly: process.env.SCHEDULE_WEEKLY,
				},
				countries: process.env.COUNTRIES.split(','),
			});
			console.log('Config initialized');
		}
	} catch(e) {
		console.error(e);
	}
})();

module.exports = { Config, config };
