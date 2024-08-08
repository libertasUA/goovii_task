const nodemailer = require("nodemailer");

const sendEmail = async (subject: string, text: string) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //get all users
  const users: { email: string }[] = [];

  let mailOptions = {
    from: process.env.EMAIL,
    to: "",
    subject,
    text,
  };

  try {
    await Promise.all(
      users.map(async (user: { email: string }) => {
        mailOptions.to = user.email;
        await transporter.sendMail(mailOptions);
      })
    );

    console.log("Email sent");
  } catch (err) {
    console.error("Error sending email", err);
  }
};

export default sendEmail;
