
function reconcile() {
  console.log('Starting');

  const MAX_TRIAL = 3;
  const TIMEOUT = 2000;
  let lines = document.querySelectorAll("#statementLines > .line");
  let running = false;

  const getCode = (line) => line.querySelectorAll('.bank-transaction .details-container > .details > span')[3].innerHTML
  const clickFindAndMatch = (line) => line.querySelector(".statement > .tabs > a.t5.find").click()

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const submitOk = (line, trial = 0) => {
    const okBtn = line.querySelector('.findMatch .actions a.reconcileButton');

    if (!okBtn && (trial < MAX_TRIAL)) {
      setTimeout(() => submitOk(line, trial + 1), TIMEOUT);
      return;
    }

    if (trial >= MAX_TRIAL) {
      console.log('Failed OK');
      return false;
    }

    setTimeout(() => {
      okBtn.click();
      running = false;
    }, TIMEOUT);
  }

  const unselectAll = (line) => {
    const selectedList = line.querySelectorAll('#selectedTransactionList > div');

    selectedList.forEach(div => {
      div.querySelector('input.checkbox').click()
    })
  }

  const selectAll = (line, trial = 0) => {
    const div = line.querySelector('.findMatch #selectAllToggle label#selectAllLabel');
    const availableList = line.querySelectorAll('#availableTransactionList > div');

    if ((!availableList || !div) && (trial < MAX_TRIAL)) {
      setTimeout(() => selectAll(line, trial + 1), TIMEOUT);
      return;
    }

    if (availableList.length <= 0) {
      setTimeout(() => selectAll(line, trial + 1), TIMEOUT);
      return;
    }

    // TODO: validate the content of the selected items

    if (trial >= MAX_TRIAL) {
      console.log('Failed Select All');
      return false;
    }

    div.click();

    submitOk(line);
  }

  const searchAndConfirm = (line, code, trial = 0) => {
    const div = line.querySelector('.findMatch .bankrec-search-form');

    if (!div && (trial < MAX_TRIAL)) {
      setTimeout(() => searchAndConfirm(line, code, trial + 1), TIMEOUT);
      return;
    }

    if (trial >= MAX_TRIAL) {
      console.log('Failed Search And Confirm');
      return false;
    }

    unselectAll(line);

    const input = div.querySelector('input#searchNameText');

    input.value = code;
    div.querySelector('.xbtn').click();

    selectAll(line);
  }

  const runFindAndMatch = (line) => {
    const code = getCode(line);
    console.log(code);

    clickFindAndMatch(line);
    searchAndConfirm(line, code);
  }

  const line = lines[0];
  runFindAndMatch(line);
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: reconcile
  });
});
