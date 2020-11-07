const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeMessage = (email, name) => {
    const msg = {
        from: "toobaalined@gmail.com",
        to: email,
        subject: "Thank you for joining Task Manager App",
        text: `Hey, ${name} , We  welcome you to our task manager app. Learn more here!`
    }

    sgMail.send(msg).then(() => {
        console.log("message sent!");

    }).catch((error) => {
        console.log(error.response.body);

    });
}

const sendCancelMessage = (email, name) => {
    const msg = {
        from: "toobaalined@gmail.com",
        to: email,
        subject: "Sorry for any inconvinience",
        text: `Sorry ${name}, You just deleted your account from our app! Was there some problem? Let us know!`

    }

    sgMail.send(msg).then(() => {
        console.log("message sent!");

    }).catch((e) => {
        console.log(e);

    })
}

module.exports = {
    sendWelcomeMessage,
    sendCancelMessage
}