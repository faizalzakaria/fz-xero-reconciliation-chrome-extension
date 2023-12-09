const rows = document.querySelectorAll('#ext-gen27 .x-grid3-row');
rows.forEach(row => {
  const description = row.querySelector('.x-grid3-td-colDescription div').innerHTML
  if (description === 'PER PAYMENT RECEIVED FEE') {
    row.addClassName('x-grid3-row-selected'); 
  }
})
