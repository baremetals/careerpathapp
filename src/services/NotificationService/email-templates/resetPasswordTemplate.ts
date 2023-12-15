export const resetPasswordTemplate = (firstName: string, resetURL: string) => {
  return `
      <p>Hi ${firstName},</p><br>
      <br>
      <p>${msg}</p><br>
      <br>
      <br>
      <a href="${resetURL}" target='_blank' data-cy="activation-link"><button type="button">Submit</button></a>
    `;
};

const msg = `So, you've lost your password! That was clever. Please use the button below to reset your password.
      Your password reset link is only valid for 24 hours)
      `;
