import {cards}  from './cards';
import categoryInstance from './category';
import stats from './statistics';
import menuInstance from './menu';
import state from './state';

const container: HTMLElement | null = document.querySelector('#main-container');
const categoryCardTemplate: HTMLTemplateElement | null = document.querySelector('#categoryTemplate');
const pageTitle: HTMLLinkElement | null = document.querySelector('#page-title-text');
const categoriesArr = cards;
const header: HTMLElement | null = document.querySelector('.header');
const footer: HTMLElement | null = document.querySelector('.footer');
const statsBtn: HTMLElement | null = document.querySelector('.stats-btn');
const LoginBtn: HTMLElement | null = document.querySelector('.login-btn');

class MainPage {
  loadMainPage(): void {
    if (header) header.style.visibility = 'visible';
    if (footer) footer.style.visibility = 'visible';
    state.page = 0;
    if (pageTitle) pageTitle.textContent = 'English for kids';
    if (container) container.innerHTML = '';

    const categoriesList = document.createElement('ul');
    categoriesList.classList.add('cards__list');

    categoriesArr.forEach((category) => {
      if (category.isVisibleInMenu) {
        const categoryCard = document.createElement('li');
        categoryCard.classList.add('cards__item');
        if (categoryCardTemplate) categoryCard.append(categoryCardTemplate.content.cloneNode(true));

        const cardImg = categoryCard.querySelector('.card__img');
        cardImg?.setAttribute('src', `${category.img}`);
        const cardTitle = categoryCard.querySelector('.card__title');
        if (cardTitle) cardTitle.textContent = `${category.title}`;

        categoryCard.addEventListener('click', () => {
          categoryInstance.loadCategoryPage(category);
          menuInstance.changeActiveLink(category.title);
        });

        categoriesList.append(categoryCard);
        container?.append(categoriesList);
      }
    });

    statsBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      stats.loadStatsPage();
    });
  }
}

const mainPage = new MainPage();
mainPage.loadMainPage();

export default mainPage;