import { cards1 } from './cards';
import categoryInstance from './category';

const container: HTMLElement | null = document.querySelector('#main-container');
const pageTitle: HTMLElement | null = document.querySelector('#page-title-text');
let cardsWords = cards1;

class Stats {
  getStatistics(): void {
    cardsWords = JSON.parse(localStorage.getItem('statistics')!);

    if (!cardsWords) {
      cardsWords = cards1;
    } else {
      const filteredArr = cardsWords[cardsWords.length - 1];
      filteredArr.forEach((card) => {
        for (let i = 0; i < cardsWords.length - 1; i++) {
          for (let j = 0; j < cardsWords[i].length; j++) {
            if (cardsWords[i][j].word === card.word) {
              cardsWords[i][j].trained = card.trained;
              cardsWords[i][j].correct = card.correct;
              cardsWords[i][j].errors = card.errors;
              cardsWords[i][j]['%'] = parseInt(String((1 - (<number>cardsWords[i][j].errors) / ((<number>cardsWords[i][j].correct) + (<number>cardsWords[i][j].errors))) * 100), 10);
              if (Number.isNaN(cardsWords[i][j]['%'])) cardsWords[i][j]['%'] = 0;
            }
          }
        }
      });
      cardsWords[cardsWords.length - 1] = [];
      localStorage.setItem('statistics', JSON.stringify(cardsWords));
    }
  }

  loadStatsPage(): void {
    if (pageTitle) pageTitle.textContent = 'Statistics';
    if (container) container.innerHTML = '';

    this.getStatistics();

    const statsTable = document.createElement('table');
    statsTable.classList.add('stats-table');

    const tableRow = document.createElement('tr');
    tableRow.classList.add('stats-table__row');

    const tableHeaders = ['category', 'word', 'translation', 'trained', 'correct', 'errors', '%'];

    tableHeaders.forEach((item, i) => {
      const tableHeader = document.createElement('th');
      tableHeader.classList.add('stats-table__header');
      tableHeader.textContent = `${item}`;
      tableHeader.setAttribute('title', 'Press to sort');

      tableHeader.addEventListener('click', () => {
        const headers = statsTable.querySelectorAll('.stats-table__header');

        headers.forEach((item) => {
          item.classList.remove('stats-table__header--ascend');
          item.classList.remove('stats-table__header--descend');
        });

        if (tableHeader.getAttribute('data-sorted') === null) {
          tableHeader.setAttribute('data-sorted', 'descend');
          tableHeader.classList.add('stats-table__header--descend');

          const sortedRows = Array.from(statsTable.rows)
            .slice(1)
            .sort((rowA, rowB) => (rowA.cells[i].innerHTML > rowB.cells[i].innerHTML ? 1 : -1));

          statsTable.append(...sortedRows);
        } else if (tableHeader.getAttribute('data-sorted') === 'descend') {
          tableHeader.setAttribute('data-sorted', 'ascend');
          tableHeader.classList.add('stats-table__header--ascend');

          const sortedRows = Array.from(statsTable.rows)
            .slice(1)
            .sort((rowA, rowB) => (rowA.cells[i].innerHTML < rowB.cells[i].innerHTML ? 1 : -1));

          statsTable.append(...sortedRows);
        } else if (tableHeader.getAttribute('data-sorted') === 'ascend') {
          tableHeader.setAttribute('data-sorted', 'descend');
          tableHeader.classList.add('stats-table__header--descend');

          const sortedRows = Array.from(statsTable.rows)
            .slice(1)
            .sort((rowA, rowB) => (rowA.cells[i].innerHTML > rowB.cells[i].innerHTML ? 1 : -1));

          statsTable.append(...sortedRows);
        }
      });

      tableRow.append(tableHeader);
    });

    statsTable.append(tableRow);

    cardsWords.forEach((group) => {
      group.forEach((word) => {
        const tableRow = document.createElement('tr');
        tableRow.classList.add('stats-table__row');

        word['%'] = parseInt(String((1 - (<number>word.errors) / ((<number>word.correct) + (<number>word.errors))) * 100), 10);
        if (Number.isNaN(word['%'])) word['%'] = 0;

        for (const prop in word) {
          if (tableHeaders.includes(prop)) {
            const tableCell = document.createElement('td');
            tableCell.classList.add('stats-table__cell');
            tableCell.textContent = `${word[prop]}`;

            tableRow.append(tableCell);
          }
        }

        statsTable.append(tableRow);
      });
    });

    const tableWrap = document.createElement('div');
    tableWrap.classList.add('stats-wrap');
    tableWrap.append(statsTable);

    container?.append(tableWrap);

    this.renderBtns();
  }

  renderBtns(): void {
    const statsBtns = document.createElement('div');
    statsBtns.classList.add('stats-btns');
    const repeatBtn = document.createElement('button');
    repeatBtn.classList.add('stats-btns__repeat');
    repeatBtn.textContent = 'Repeat difficult words';
    const resetBtn = document.createElement('button');
    resetBtn.classList.add('stats-btns__reset');
    resetBtn.textContent = 'Reset';

    resetBtn.addEventListener('click', () => {
      cardsWords.forEach((group) => {
        group.forEach((word) => {
          word.trained = 0;
          word.correct = 0;
          word.errors = 0;
          word['%'] = 0;
        });
      });

      localStorage.setItem('statistics', JSON.stringify(cardsWords));

      this.loadStatsPage();
    });

    repeatBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      const filteredArr = [];

      for (let i = 0; i < cardsWords.length - 1; i++) {
        for (let j = 0; j < cardsWords[i].length; j++) {
          if (cardsWords[i][j]['%'] !== 0 && cardsWords[i][j]['%'] !== 100) {
            filteredArr.push(cardsWords[i][j]);
          }
        }
      }

      cardsWords = JSON.parse(localStorage.getItem('statistics')!);
      cardsWords.splice(-1, 1, filteredArr);
      localStorage.setItem('statistics', JSON.stringify(cardsWords));

      categoryInstance.loadCategoryPage({
        title: 'Repeat',
        img: '',
        index: 8,
        isVisibleInMenu: false,
      });
    });

    statsBtns.append(repeatBtn);
    statsBtns.append(resetBtn);

    container?.prepend(statsBtns);
  }
}

const stats = new Stats();
export default stats;