import * as EmailValidator from 'email-validator';
import nodemailer from "nodemailer"

export async function post(request) {
  const body = request.body

  if (!EmailValidator.validate(body.email)) {
    return { body: { message: 'Sorry, I cannot send it. My system thinks this email is invalid.' } }
  }

  if (!body.message || !body.message.length === 0) {
    return { body: { message: 'Empty message' } }
  }

  let transporter = nodemailer.createTransport({
    host: 'mail',
    port: 25,
  });

  transporter.sendMail({
    from: body.email,
    to: 'hi@diggy.sh',
    subject: 'Diggy - Contact Form',
    text: body.message
  }, (err, info) => {
    console.log(err)

    if (info) {
      console.log(info.envelope);
      console.log(info.messageId);
    }
  });
  
  return { body: { message: 'Message sent!' } }
}

