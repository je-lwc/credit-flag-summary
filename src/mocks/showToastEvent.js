class ShowToastEvent extends CustomEvent {
  constructor({ title, message, variant }) {
    super();
    console.log('Show Toast', title, message, variant);
  }
}

export { ShowToastEvent };
