
function reconcile() {
  console.log('Reconciling transaction');

  const MAX_TRIAL = 3;
  const TIMEOUT = 1000;
  let running = false;

  const getCode = (line) => line.querySelectorAll('.bank-transaction .details-container .line-details > span')[3].innerHTML
  const clickFindAndMatch = (line) => line.querySelector(".statement > .tabs > a.t5.find").click()

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function submitOk(line, trial = 0) {
    const okBtn = line.querySelector('.findMatch .actions a.reconcileButton');

    if (!okBtn && (trial < MAX_TRIAL)) {
      await sleep(1000);
      await submitOk(line, trial + 1);
      return;
    }

    if (trial >= MAX_TRIAL) {
      console.log('Failed OK');
      return false;
    }

    await sleep(1000);
    okBtn.click();

    console.log('Submitted ok');
  }

  const unselectAll = (line) => {
    const selectedList = line.querySelectorAll('#selectedTransactionList > div');

    selectedList.forEach(div => {
      div.querySelector('input.checkbox').click()
    })
  }

  async function selectAll(line, trial = 0) {
    const div = line.querySelector('.findMatch #selectAllToggle label#selectAllLabel');
    const availableList = line.querySelectorAll('#availableTransactionList > div');

    if ((!availableList || !div) && (trial < MAX_TRIAL)) {
      await sleep(1000);
      await selectAll(line, trial + 1);
      return;
    }

    if (availableList.length <= 0) {
      await sleep(1000)
      await selectAll(line, trial + 1);
      return;
    }

    // TODO: validate the content of the selected items

    if (trial >= MAX_TRIAL) {
      console.log('Failed Select All');
      return false;
    }

    div.click();

    await sleep(500);

    console.log('Selected All');

    submitOk(line);
  }

  async function searchAndConfirm(line, code, trial = 0) {
    const div = line.querySelector('.findMatch .bankrec-search-form');

    if (!div && (trial < MAX_TRIAL)) {
      await sleep(2000);
      await searchAndConfirm(line, code, trial + 1);
      return false;
    }

    if (trial >= MAX_TRIAL) {
      console.log('Failed Search And Confirm');
      return false;
    }

    unselectAll(line);

    const input = div.querySelector('input#searchNameText');

    input.value = code;
    div.querySelector('.xbtn').click();

    console.log('searched and confirmed');

    await selectAll(line);
  }

  async function runFindAndMatch(line) {
    const code = getCode(line);
    console.log(code);

    clickFindAndMatch(line);
    await searchAndConfirm(line, code);
  }

  async function runAll() {
    let lines = document.querySelectorAll("#statementLines > .line");

    for (const line of lines) {
      console.log('Running line');
      await runFindAndMatch(line);
      await sleep(1500);
    }
  }

  runAll();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, tabId } = message;

  switch (action) {
    case 'reconcile_transaction':
      chrome.scripting.executeScript({
        target: { tabId },
        function: reconcile
      });
      break;
    case 'reconcile_transfer':
      chrome.scripting.executeScript({
        target: { tabId },
        files: ['reconcile_transfer.js']
      });
      break;
    case 'mark_as_billplz_fee':
      chrome.scripting.executeScript({
        target: { tabId },
        files: ['mark_as_billplz_fee.js']
      });
      break;
  }
});
