const state = {
  page: 0,
  play: false,
  gameActive: false,
  randomArr: [],
  currentCard: 0,
  gameErrors: 0,
} as {
  page: number;
  play: boolean;
  gameActive: boolean;
  randomArr: HTMLAudioElement[];
  currentCard: number;
  gameErrors: number;
};

export default state;
