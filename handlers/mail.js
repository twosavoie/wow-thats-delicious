const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

// instead of using what you see in mailtrap, use this so the credentials are hidden in the variables.env file
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// To test that email is working. Leaving this in means a test email will be sent anytime the server starts.
// transport.sendMail({
//   from:'Lisa Savoie <twosavoie@gmail.com>',
//   to: "randooo@example.com",
//   subject: 'Just giving this a try',
//   html: 'Hey I <strong>love</strong> you',
//   text: 'Hey I **love you**'
// })

// this is const not exports since we're only using it in this file we don't need to export it
const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  const inlined = juice(html);
  return inlined;
}

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: `Lisa Savoie <twosavoie@gmail.com>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
}