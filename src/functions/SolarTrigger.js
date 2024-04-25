const { app } = require('@azure/functions');

app.http('SolarTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';

        return { body: `Hello, ${name}!` };
    }
});

const nodemailer = require('nodemailer');

module.exports = async function (context, req) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // Access the EMAIL environment variable
            pass: process.env.PASSWORD // Access the PASSWORD environment variable
        }
    });

    let mailOptions1 = {
        from: process.env.EMAIL, // Access the EMAIL environment variable
        to: process.env.EMAIL, // Access the EMAIL environment variable
        subject: 'New Contact Request',
        text: `Email: ${req.body.email}`,
    };

    let mailOptions2 = {
        from: process.env.EMAIL, // Access the EMAIL environment variable
        to: req.body.email, // Send to the submitted email address
        subject: 'Welcome to Solar Power Website',
        text: 'Contact sales was successful. Welcome to Solar Power Website!',
    };

    try {
        await transporter.sendMail(mailOptions1);
        await transporter.sendMail(mailOptions2);
        context.res = { status: 200, body: 'Emails sent.' };
    } catch (error) {
        context.res = { status: 500, body: 'Error sending emails.' };
    }
};

