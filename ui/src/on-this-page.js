import { html, render } from 'lit-html';
import { onLoad } from './utils/on-load';

onLoad(() => {
  const main = document.querySelector('main');
  const article = main?.querySelector('article');

  if (article) {
    const headings = article.querySelectorAll('h2, h3');
    const toc = { level: 'H0', items: [] };
    const queue = [toc];
    for (const h of headings) {
      const item = {
        level: h.tagName,
        title: h.textContent,
        id: h.id,
        items: [],
      };
      while (queue.length > 1 && queue[0].level >= item.level) {
        queue.shift();
      }
      queue[0].items.push(item);
      queue.unshift(item);
    }

    const tree = (items, pad = true) => html`
      <ul class=${pad && "pl-4"}>
        ${items.map(i => html`
          <li>
          <a class="block p-2 rounded hover:bg-slate-50" href="#${i.id}">${i.title}</a>
          ${i.items.length ? tree(i.items) : ''}
          </li>
        `)}
      </ul>
    `;

    const t = html`
      <div class="main-side-column">
        <h1 class="p-2 font-semibold"><a href="#">On this page</a></h1>
        ${tree(toc.items, false)}
      </div>
    `;

    const container = document.createElement('div');
    render(t, container);
    main.append(...container.childNodes);
  }
});
