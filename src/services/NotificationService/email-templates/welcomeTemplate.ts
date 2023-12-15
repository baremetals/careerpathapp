export const welcomeTemplate = (firstName: string, url: string) => {
  return `
      <p>Hi ${firstName},</p><br>
      <br>
      <p>${msg}</p><br>
      <br>
      <br>
      <a href="${url}" target='_blank' data-cy="access-link"><button type="button">Login</button></a>
    `;
};

const msg = `Thanks for signing up, please use the button below to access your account!`;
