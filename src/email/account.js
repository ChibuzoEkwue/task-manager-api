const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcome =(email,name)=>{
  sgMail.send({
      to:email,
      from:'chieezy5@gmail.com',
      subject:'Welcome',
      text:`Welcome to the app ${name}`
  })
}

const exitMail =(email,name)=>{
    sgMail.send({
        to: email,
        from: 'chieezy5@gmail.com',
        subject: 'Sorry to see you go',
        text: `Hi ${name} your account has been deleted. Is there anything we could have done to keep you`
    })
}

module.exports={
    sendWelcome,
    exitMail
}
