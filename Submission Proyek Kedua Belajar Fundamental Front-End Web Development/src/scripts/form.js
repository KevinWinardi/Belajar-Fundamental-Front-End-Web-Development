class Form extends HTMLElement {
  static observedAttributes = ["display"];
  constructor() {
    super();
    this._display = this.getAttribute("display");
    this._style = document.createElement("style");
  }
  updateStyle() {
    this._style.textContent = `
            ${this.localName}{
                display: ${this._display};
            }
        `;
  }
  render() {
    this.updateStyle();
    this.innerHTML = `
            ${this._style.outerHTML}
            <form>
                <div>
                    <label for="title-note">Title note</label>
                    <input type="text" name="title-note" id="title-note" aria-describedby="titleNoteValidation" required>
                    <p id="titleNoteValidation" class="validation"></p>
                </div>
                <div>
                    <label for="body-note">Body note</label>
                    <textarea name="body-note" id="body-note" cols="50" rows="8" maxlength="500" aria-describedby="bodyNoteValidation" required></textarea>
                    <p id="bodyNoteValidation" class="validation"></p>
                </div>
                <label for="checkbox">Archive</label>
                <input type="checkbox" id="checkbox"></input>
                <button class="button" id="add-button"><i class="fa fa-plus"></i></button>
            </form>
        `;
  }
  attributeChangedCallback(name, newValue) {
    this[`_${name}`] = newValue;
    this.render();
  }
}
export default Form;
