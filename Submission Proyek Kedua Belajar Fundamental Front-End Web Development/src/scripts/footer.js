class Footer extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    this.innerHTML = `
            <footer>
                <p> Notes App </p>
                <p> By : Kevin Winardi @ 2024 </p>
            </footer>
        `;
  }
}
export default Footer;
