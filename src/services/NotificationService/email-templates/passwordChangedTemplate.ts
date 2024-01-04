export const passwordChangedTemplate = (firstName: string, url: string) => {
  return `
      <p>Hi ${firstName},</p><br>
      <br>
      <p>${msg}</p><br>
      <br>
      <br>
      <a href="${url}" target='_blank' data-cy="access-link"><button type="button">Login</button></a>
    `;
};

const msg = `Your password has been changed. 
    If you did not make this request please contact support.`;
