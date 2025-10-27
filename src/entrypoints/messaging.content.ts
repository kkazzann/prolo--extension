export default defineContentScript({
  matches: ['<all_urls>'],
  main: () => {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'getTableData') {
        const table = document.querySelector('#list_table');

        const rows: Array<{ value: string }> = [];

        if (table) {
          const headerRow = table.querySelector('thead tr.tablesorter-headerRow');
          let saColumnIndex: number | undefined = undefined;

          // find which column has "SA#" (product ids)
          if (headerRow) {
            const headerCells = headerRow.querySelectorAll('th, td');

            headerCells.forEach((cell, index) => {
              if (cell.textContent?.includes('SA#')) {
                saColumnIndex = index;
              }
            });
          }

          if (saColumnIndex !== undefined) {
            const trs = table.querySelector('tbody')!.querySelectorAll('tr');

            trs.forEach((tr, index) => {
              const tds = tr.querySelectorAll('td');
              const targetCell = tds[saColumnIndex as number];

              rows.push({
                value: targetCell?.textContent?.trim(),
              });
            });
          }
        }

        // sending response back to the popup
        sendResponse({
          exists: !!table,
          rows: rows,
        });
      }

      if (message.action === 'getWindowOrigin') {
        sendResponse({
          origin: window.origin,
        });
      }

      // keep channel open
      return true;
    });
  },
});
