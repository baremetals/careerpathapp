export const accountActivationTemplate = (firstName: string, url: string) => {
  return `
      <p>Hi ${firstName},</p><br>
      <br>
      <p>${msg}</p><br>
      <br>
      <br>
      <a href="${url}" target='_blank' data-cy="activation-link"><button type="button">Submit</button></a>
    `;
};

const msg = `Account creation was initiated. Follow the link below to activate your account.`;
