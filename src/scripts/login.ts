const cover: HTMLElement | null = document.querySelector('.cover');
const loginForm: HTMLFormElement | null = document.querySelector('.login');
const formInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('.login__input')

class Login {
  loadLogin(): void {

    if (cover) cover.style.visibility = 'hidden';
    if (loginForm) loginForm.style.visibility = 'hidden';

    const openLoginFormBtn = document.querySelector('.login-btn__open');
    const cancelBtn = document.querySelector('.cancel-btn');
    const enterBtn = document.querySelector('.login-btn__enter');

    openLoginFormBtn?.addEventListener('click', this.openForm);

    cancelBtn?.addEventListener('click', this.closeForm);
    cover?.addEventListener('click', this.closeForm);
  }

  openForm(): void {
    if (cover) cover.style.visibility = 'visible';
    if (loginForm) loginForm.style.visibility = 'visible';
  }

  closeForm(): void {
    if (cover) cover.style.visibility = 'hidden';
    if (loginForm) loginForm.style.visibility = 'hidden';
    formInputs.forEach(field => field.value = "");
  }
}

const login = new Login();
login.loadLogin();

export default login;