document.querySelectorAll('#ext-gen27 .x-grid3-row').forEach(row => {
  const description = row.querySelector('.x-grid3-td-colDescription div').innerHTML
  if (description === 'PER PAYMENT RECEIVED FEE') {
    row.classList.add('x-grid3-row-selected');
  }
})

