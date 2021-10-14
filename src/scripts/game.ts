import state from './state';
import mainPage from './mainPage';
import menuInstance from './menu';

const audioError: HTMLAudioElement | null = document.querySelector('.audio-error');
const audioCorrect: HTMLAudioElement | null = document.querySelector('.audio-correct');
const audioSuccess: HTMLAudioElement | null = document.querySelector('.audio-success');
const audioFailure: HTMLAudioElement | null = document.querySelector('.audio-failure');
const container: HTMLElement | null = document.querySelector('#main-container');
const header: HTMLElement | null = document.querySelector('.header');
const footer: HTMLElement | null = document.querySelector('.footer');

class Game {
  init(): void {
    document.addEventListener('gameStarted', () => {
      state.gameActive = true;
      this.playCurrentSound();
    });

    document.addEventListener('cardClicked', (e) => {
      const targetSrc = state.randomArr[state.currentCard].src;
      const clickedCard = (<CustomEvent>e).detail.wordCard.querySelector('.card');
      const clickedCardAudioSrc = (<CustomEvent>e).detail.wordCard.querySelector('audio').src;

      if (clickedCard.classList.contains('card--disabled') === false) {
        if (clickedCardAudioSrc === targetSrc) {
          audioCorrect?.play();
          clickedCard.classList.add('card--disabled');
          state.currentCard++;
          this.addStar('star');

          (<CustomEvent>e).detail.word.correct += 1;
          localStorage.setItem('statistics', JSON.stringify((<CustomEvent>e).detail.cardsArr));

          if (this.isGameFinished()) {
            setTimeout(this.finishGame, 500);
          } else {
            setTimeout(this.playCurrentSound, 500);
          }
        } else {
          audioError?.play();
          this.addStar('star--error');
          state.gameErrors++;
          (<CustomEvent>e).detail.word.errors += 1;
          localStorage.setItem('statistics', JSON.stringify((<CustomEvent>e).detail.cardsArr));
        }
      }
    });
  }

  playCurrentSound(): void {
    state.randomArr[state.currentCard].play();
  }

  addStar(starClass: string): void {
    const starsContainer = document.querySelector('.stars');
    const star = document.createElement('li');
    star.classList.add(`${starClass}`);
    starsContainer?.append(star);
  }

  isGameFinished(): boolean {
    return state.currentCard === state.randomArr.length;
  }

  finishGame(): void {
    if (header) header.style.visibility = 'hidden';
    if (footer) footer.style.visibility = 'hidden';
    if (container) container.innerHTML = '';

    const gameResult = document.createElement('div');
    const gamePicture = document.createElement('div');
    const gameInfo = document.createElement('div');
    gameResult.classList.add('game-result');
    gameInfo.classList.add('game-info');

    if (state.gameErrors === 0) {
      audioSuccess?.play();

      gameInfo.textContent = 'You did it!';
      gamePicture.classList.add('game-success');
      gameResult.append(gameInfo);
      gameResult.append(gamePicture);
    } else {
      audioFailure?.play();

      if (state.gameErrors === 1) {
        gameInfo.textContent = 'You made 1 mistake. Try again!';
      } else {
        gameInfo.textContent = `You made ${state.gameErrors} mistakes. Try again!`;
      }
      gamePicture.classList.add('game-failure');
      gameResult.append(gameInfo);
      gameResult.append(gamePicture);
    }
    container?.append(gameResult);

    setTimeout(mainPage.loadMainPage, 4000);
    menuInstance.changeActiveLink('Main page');
    state.gameActive = false;
    state.randomArr = [];
    state.currentCard = 0;
    state.gameErrors = 0;
  }
}

const game = new Game();
game.init();