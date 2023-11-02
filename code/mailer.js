const nodemailer = require('nodemailer');
const smtpSrv = process.env.SMTPSRV;
const smtpPort = process.env.SMTPPORT;
const smtpSecure = process.env.SMTPSECURE;
const smtpUser = process.env.SMTPUSER;
const smtpPassword = process.env.SMTPPASSWORD;
function sendEmail(to, messageType, values) {
    const transporter = nodemailer.createTransport({
        host: smtpSrv,
        port: smtpPort, 
        secure: smtpSecure,
        auth: {
        user: smtpUser,
        pass: smtpPassword
        }
    });
    let subject, text, bbc;

    if (messageType === 'newUser') {
        subject = 'Welcome to RCIoTs';
        const username = values[0];
        const mail = to;
        text = `Dear ${username},

        I'm thrilled to welcome you to our community! Thank you for registering with rciots.com. Your account is now active, and you can start enjoying all the benefits and features our platform has to offer.
        
        Here are a few key details about your account:
        - Username: ${username}
        - Email Address: ${mail}
        
        If you have any questions or need assistance, please don't hesitate to reach out to me at mparrade@redhat.com or visit the FAQ page https://www.rciots.com/faq.
        
        Best regards,
        RCIoTs Team.`;
    } else if (messageType === 'recoverPassword') {
        const username = values[0];
        const token = values[1];
        subject = 'RCIoTs Password recovery';
        text = `Dear ${username},
        
        We have received a request to reset your password. To reset your password, please click the following link: 
        https://www.rciots.com/passwordrecovery/${token}
        
        If you did not request a password reset, please ignore this email.
        
        Thank you,
        RCIoTs Team.`;
    } else if (messageType === 'newToken') {
        const username = values[0];
        const enrollmentToken = values[1];
        subject = 'RCIoTs New Enrollment Token Created';
        text = `Dear ${username},
        
        We are pleased to inform you that a new enrollment token has been created for your devices. This token is used to configure and enroll your devices in our system.

        To use the enrollment token, please follow the instructions in our documentation:
        
        Documentation: https://www.rciots.com/documentation
        
        Enrollment Token: ${enrollmentToken}
        
        If you have any questions or need assistance, please contact our support team.
        
        Thank you,
        RCIoTs Team.`;
    } else if (messageType === 'notification') {
      subject = values[0];
      text = values[1];
      bcc = values[2];
    }
    var mailOptions = {
        from: 'rciots@rciots.com',
        to: to,
        subject: subject,
        text: text
    };
    if (bbc) {
        mailOptions.bbc = bbc;
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.log('Error sending email: ' + error);
        } else {
        console.log('Email sended: ' + info.response);
        }
        console.log("MAIL DATA: " + JSON.stringify(mailOptions));
    });
};

module.exports = { sendEmail };