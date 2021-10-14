import {cards1} from './cards';
import state from './state';

const container: HTMLElement | null = document.querySelector('#main-container');
const cardTemplate: HTMLTemplateElement | null = document.querySelector('#cardTemplate');
const pageTitle: HTMLElement | null = document.querySelector('#page-title-text');
let cardsArr = cards1;
const btnsTemplate: HTMLTemplateElement | null = document.querySelector('#btnsTemplate');

class Category {
  btns: HTMLButtonElement | null;

  startButton: HTMLButtonElement | null;

  stars: HTMLUListElement | null;

  wordCards: NodeListOf<HTMLLIElement> | null;

  cardsList: HTMLUListElement | null;

  audioList: HTMLAudioElement[];

  constructor() {
    this.btns = null;
    this.startButton = null;
    this.stars = null;
    this.wordCards = null;
    this.cardsList = null;
    this.audioList = [];
  }

  loadCategoryPage(category: {
    title: string,
    img: string,
    index: number,
    isVisibleInMenu: boolean,
  }): void {
    state.page = category.index + 1;
    container?.classList.add('container--category');
    if (pageTitle) pageTitle.textContent = `${category.title}`;
    if (container) container.innerHTML = '';

    this.audioList = [];
    this.cardsList = document.createElement('ul');
    this.cardsList.classList.add('cards__list');

    if (localStorage.getItem('statistics')) {
      cardsArr = JSON.parse(localStorage.getItem('statistics')!);
    } else {
      localStorage.setItem('statistics', JSON.stringify(cardsArr));
    }

    const wordsList = cardsArr[category.index];

    wordsList.forEach((word) => {
      const wordCard = document.createElement('li');
      wordCard.classList.add('cards__item');
      if (cardTemplate) wordCard.append(cardTemplate.content.cloneNode(true));

      const cardImg = wordCard.querySelectorAll('.card__img');
      cardImg.forEach((card) => {
        card.setAttribute('src', `${word.image}`);
      });
      const cardAudio: HTMLAudioElement | null = wordCard.querySelector('.card__audio');
      cardAudio?.setAttribute('src', `${word.audioSrc}`);
      if (cardAudio) this.audioList.push(cardAudio);

      const cardTitle = wordCard.querySelector('.card__title');
      if (cardTitle) cardTitle.textContent = `${word.word}`;
      const cardTranslation = wordCard.querySelector('.card__translation');
      if (cardTranslation) cardTranslation.textContent = `${word.translation}`;
      const rotateCardBtn = wordCard.querySelector('.card__rotate');
      const cardFront = wordCard.querySelector('.card__front');
      const cardBack = wordCard.querySelector('.card__back');

      cardFront?.addEventListener('click', () => {
        if (!state.play) {
          cardAudio?.play();
          (<number>word.trained) += 1;
          localStorage.setItem('statistics', JSON.stringify(cardsArr));
        }
        if (state.play && state.gameActive) {
          const event = new CustomEvent('cardClicked', {
            bubbles: true,
            detail: { wordCard, word, cardsArr },
          });
          wordCard.dispatchEvent(event);
        }
      });

      rotateCardBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        cardFront?.classList.add('card__front--rotate');
        cardBack?.classList.add('card__back--rotate');

        (<number>word.trained) += 1;
        localStorage.setItem('statistics', JSON.stringify(cardsArr));
      });

      wordCard.addEventListener('mouseleave', () => {
        cardFront?.classList.remove('card__front--rotate');
        cardBack?.classList.remove('card__back--rotate');
      });

      this.cardsList?.append(wordCard);
      if (this.cardsList) container?.append(this.cardsList);
    });

    this.wordCards = this.cardsList.querySelectorAll('.card--word');

    if (state.play) {
      this.wordCards.forEach((card) => {
        card.classList.add('card--play');
      });
      this.generateRandomArr();
    }

    this.stars = document.createElement('ul');
    this.stars.classList.add('stars');
    container?.prepend(this.stars);

    this.renderBtns();

    if (!state.play) {
      this.btns?.classList.add('buttons--hidden');
      this.stars.classList.add('stars--hidden');
    }
  }

  renderBtns(): void {
    if (btnsTemplate) container?.prepend(btnsTemplate.content.cloneNode(true));
    if (container) this.btns = container.querySelector('.buttons');

    this.startButton = document.querySelector('.buttons__btn');

    this.startButton?.addEventListener('click', () => {
      if (this.startButton?.classList.contains('buttons__repeat') === false) {
        this.startButton.classList.add('buttons__repeat');

        const event = new CustomEvent('gameStarted', { bubbles: true });
        this.startButton.dispatchEvent(event);
      } else {
        state.randomArr[state.currentCard].play();
      }
    });
  }

  changeMode(mode: boolean): void {
    this.wordCards?.forEach((card) => {
      if (mode) {
        card.classList.add('card--play');
      } else {
        card.classList.remove('card--play');
      }
    });

    if (mode && container?.classList.contains('container--category')) {
      this.btns?.classList.remove('buttons--hidden');
      this.stars?.classList.remove('stars--hidden');
    } else if (!mode && container?.classList.contains('container--category')) {
      this.btns?.classList.add('buttons--hidden');
      this.stars?.classList.add('stars--hidden');
    }

    if (mode) {
      this.startButton?.classList.remove('buttons__repeat');
      this.generateRandomArr();
    }
  }

  generateRandomArr(): void {
    const arr = this.audioList;
    const randomArr = arr.sort(() => Math.random() - 0.5);
    this.audioList = randomArr;

    state.randomArr = randomArr;
  }
}

const categoryInstance = new Category();
export default categoryInstance;