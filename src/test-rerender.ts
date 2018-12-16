import { LitElement, html, customElement, property } from '@polymer/lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { calendar } from './calendar.js';

function renderItems() {
  // return this.items.map((n, idx) => {
  //   // const content = repeat(n, o => o.id, o => html`<li>${o.value}</li>`);
  //   const content = n.map(o => html`<li>${o.value}</li>`);
  //   return html`<ul class="${classMap({ clicked: this._clicked })}" .data-ul="${idx}" @click="${() => (this._clicked = !this._clicked)}">${content}</ul>`;
  // });

  // const tbodyContent = this.items.map((n, idx) => {
  //   const trContent = n.map((o, oidx) =>
  //     html`<td
  //       .data-td="${idx}-${oidx}"
  //       @click="${(ev) => {
  //         this._clicked = !this._clicked;

  //         if(ev.target.classList.contains('selected')) {
  //           ev.target.classList.remove('selected');
  //         } else {
  //           ev.target.classList.add('selected');
  //         }
  //       }}">
  //       <div>${o.value}</div>
  //     </td>`)

  //   return html`<tr class="${classMap({ clicked: this._clicked })}" .data-tr="${idx}">${trContent}</tr>`;
  // });

  const datesArr: Date[] = [];

  for (let i = -1; i < 2; i += 1) {
    const dateDate = new Date();
    const fy = dateDate.getUTCFullYear();
    const m = dateDate.getUTCMonth();
    const d = dateDate.getUTCDate();

    datesArr.push(new Date(Date.UTC(fy, m + i, d)));
  }

  const calsArr = datesArr.map((n, i) => {
    return calendar({
      firstDayOfWeek: 0,
      idOffset: i * 10,
      locale: 'en-US',
      selectedDate: n,
      showWeekNumber: true,

      weekNumberType: null,
      dayFormatterFn: null,
      fullDateFormatterFn: null,
      longWeekdayFormatterFn: null,
      narrowWeekdayFormatterFn: null,
    });
  });

  console.log(calsArr);

  const tablesContent = calsArr.map((n) => {
    const tbl = n.daysInMonth.map((o) => {
      const content = o.map(p =>
        html`
        <td
          class="${classMap({ selected: p.fullDate === this._selected, 'is-empty': p.value == null })}"
          aria-label="${p.label}"
          .data-td="${p.fullDate}"
          @click="${() => p.value && (this._selected = p.fullDate)}">
          <div>${p.value}</div>
        </td>`);

      return html`<tr>${content}</tr>`;
    });

    return html`
    <table class="table">
      <tbody>${tbl}</tbody>
    </table>
    `;
  });

  return html`<div class="calendars-container">${tablesContent}</div>`;
  }

@customElement(TestRerender.is)
export class TestRerender extends LitElement {
  static get is() {
    return 'test-rerender';
  }

  @property({ type: Array })
  public items: unknown[] = [];

  @property({ type: String })
  private _selected: string;

  public constructor() {
    super();

    // this.updateComplete
    //   .then(() => new Promise(yay => window.requestAnimationFrame(yay)))
    //   .then(() => {
    //     setInterval(() => {
    //     // setTimeout(() => {
    //       const randomized: unknown[] = [];

    //       for (let i = 0, len = 10; i < len; i += 1) {
    //         const rnd = Math.floor(Math.random() * 10);
    //         randomized.push([
    //           { id: i + 10, value: rnd + 10 },
    //           { id: i + 20, value: rnd + 20 },
    //           { id: i + 30, value: rnd + 30 },
    //           { id: i + 40, value: rnd + 40 },
    //           { id: i + 50, value: rnd + 50 },
    //           { id: i + 60, value: rnd + 60 },
    //           { id: i + 70, value: rnd + 70 },
    //         ]);
    //       }

    //       this.items = randomized;
    //     }, 1e3);
    //   });
  }

  protected render() {
    return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
        }

        * {
          box-sizing: border-box;
        }

        .container {
          display: flex;
          flex-wrap: wrap;
          flex-basis: calc(100vw / 5);
        }
        .container > ul {
          width: calc(100vw / 5);
        }

        .container > ul > li {
          position: relative;
        }
        .container > ul > li::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          width: 40px;
          height: 40px;
          background-color: #0070fb;
          color: #fff;
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        .container > ul > li:hover::after {
          opacity: 1;
        }

        .calendars-container {
          display: flex;
          flex-direction: row;
          align-items: center;

          max-width: 300px;
          width: 300px;
          margin: 24px auto;
          overflow: hidden;
        }

        .tabled {
          margin: 24px auto;
          border: 1px solid #ddd;
        }
        tr > td {
          position: relative;
          min-width: 40px;
          min-height: 40px;
          width: 40px;
          height: 40px;
          text-align: center;
        }
        tr > td > div {
          position: relative;
          z-index: 1;
        }
        tr > td::after {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          background-color: #0070fb;
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
        }
        tr > td.selected {
          color: #fff;
        }
        tr > td:not(.is-empty):not(.selected):hover::after {
          opacity: .7;
        }
        tr > td.selected::after {
          opacity: 1;
        }
      </style>

      <div class="container">
      ${renderItems.call(this)}
      </div>
    `;
  }
}
