import state from './state';
import categoryInstance from './category';

const toggle = document.querySelector('#toggle');

toggle?.addEventListener('change', (e) => {
  e.stopPropagation();

  state.play = !state.play;

  if (state.page !== 0) {
    categoryInstance.changeMode(state.play);
  }
});