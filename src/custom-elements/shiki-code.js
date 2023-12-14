import { getHighlighter } from "shikiji";

const shiki = await getHighlighter({
    themes: ["nord", "vitesse-light", "github-dark"],
    langs: ["html", "xml", "json", "csv", "css", "javascript", "typescript"],
});

class ShikiCode extends HTMLElement {
    static get observedAttributes() { return ["data-lang", "data-code"]; }

    attributeChangedCallback(name, oldValue, newValue) {
        this.setNeedsUpdate();
    }

    setNeedsUpdate() {
        if (this.needUpdate) {
            return;
        }

        requestAnimationFrame(() => {
            this.update();
        });
        this.needUpdate = true;
    }

    update() {
        console.time("shiki codeToHtml")
        const { code, lang } = this.dataset;
        const html = shiki.codeToHtml(code, {
            lang: lang,
            theme: "github-dark",
        });
        this.innerHTML = html;
        console.timeEnd("shiki codeToHtml")

        this.needUpdate = false;
    }
}

customElements.define("shiki-code", ShikiCode);
