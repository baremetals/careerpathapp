import sgMail, { MailDataRequired } from '@sendgrid/mail';

export class EmailService {
  to: string;
  firstName: string;
  url: string | undefined;
  from: string;
  constructor(user: { email: string; firstName: string }, url?: string) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Careers App <${process.env.EMAIL_FROM}>`;
  }

  // TODO: Create SendGrid templates, catch errors with sentry

  async send(subject: string, msg: string) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const html = `
      <p>Hi ${this.firstName},</p><br>
      <br>
      <p>${msg}</p><br>
      <br>
      <br>
      <a href="${this.url}" target='_blank'><button type="button">Submit</button></a>
    `;
    const mailOptions: MailDataRequired | MailDataRequired[] = {
      to: this.to,
      from: this.from,
      subject,
      text: msg,
      html,
    };
    try {
      await sgMail.send(mailOptions);
    } catch (error: any) {
      console.error(error.response.body);
    }
  }

  async sendWelcomeEmail() {
    const text =
      'Thanks for signing up, please use the button below to activate your account!';
    await this.send('Welcome to the Careers App', text);
  }

  async sendPasswordResetEmail() {
    const text = `So, you've lost your password! That was clever. Please use the button below to reset your password.
      Your password reset link is only valid for 24 hours)
      `;
    await this.send('Password Reset', text);
  }

  async sendPasswordChangeEmail() {
    const text = `Your password has been changed. 
    If you did not make this request please contact support.
      `;
    await this.send('password Changed', text);
  }
}
