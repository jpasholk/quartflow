document.addEventListener('DOMContentLoaded', () => {
  const totesInput = document.getElementById('totes');
  const cuftInput = document.getElementById('cuft');
  const slider8qt = document.getElementById('slider8qt');
  const slider16qt = document.getElementById('slider16qt');
  const slider24qt = document.getElementById('slider24qt');
  const enable8qt = document.getElementById('enable8qt');
  const enable16qt = document.getElementById('enable16qt');
  const enable24qt = document.getElementById('enable24qt');
  const qty8qt = document.getElementById('qty8qt');
  const qty16qt = document.getElementById('qty16qt');
  const qty24qt = document.getElementById('qty24qt');
  const max8qt = document.getElementById('max8qt');
  const max16qt = document.getElementById('max16qt');
  const max24qt = document.getElementById('max24qt');

  let current8qt = 0;
  let current16qt = 0;
  let current24qt = 0;

  function calculateTotalQuarts() {
    let totes = parseFloat(totesInput.value) || 0;
    let cuft = parseFloat(cuftInput.value) || 0;
    return Math.floor(totes * cuft * 25.714);
  }

  function updateMaximums() {
    let totalQuarts = calculateTotalQuarts();
    let remainingQuarts = totalQuarts - (current8qt * 8 + current16qt * 16 + current24qt * 24);

    if (enable8qt.checked) {
      let max8qtValue = Math.floor(remainingQuarts / 8) + current8qt;
      slider8qt.max = max8qtValue;
      max8qt.textContent = max8qtValue;
    }

    if (enable16qt.checked) {
      let max16qtValue = Math.floor(remainingQuarts / 16) + current16qt;
      slider16qt.max = max16qtValue;
      max16qt.textContent = max16qtValue;
    }

    if (enable24qt.checked) {
      let max24qtValue = Math.floor(remainingQuarts / 24) + current24qt;
      slider24qt.max = max24qtValue;
      max24qt.textContent = max24qtValue;
    }
  }

  function updateSliders(changedSliderId) {
    let totalQuarts = calculateTotalQuarts();
    
    if (!changedSliderId) {
      slider8qt.max = Math.floor(totalQuarts / 8);
      slider16qt.max = Math.floor(totalQuarts / 16);
      slider24qt.max = Math.floor(totalQuarts / 24);
      current8qt = 0;
      current16qt = 0;
      current24qt = 0;
      slider8qt.value = 0;
      slider16qt.value = 0;
      slider24qt.value = 0;
      updateDisplayedQuantities();
      return;
    }

    let oldValue = {
      'slider8qt': parseInt(slider8qt.value),
      'slider16qt': parseInt(slider16qt.value),
      'slider24qt': parseInt(slider24qt.value)
    }[changedSliderId];

    let newValue = parseInt({
      'slider8qt': slider8qt.value,
      'slider16qt': slider16qt.value,
      'slider24qt': slider24qt.value
    }[changedSliderId]);

    let change = newValue - oldValue;

    if (change > 0) {
      if (changedSliderId === 'slider16qt' && enable16qt.checked) {
        let new8qt = Math.max(0, parseInt(slider8qt.value) - (change * 2));
        slider8qt.value = new8qt;
        current8qt = new8qt;
        current16qt = newValue;
      } 
      else if (changedSliderId === 'slider24qt' && enable24qt.checked) {
        let new8qt = Math.max(0, parseInt(slider8qt.value) - (change * 3));
        let new16qt = Math.max(0, parseInt(slider16qt.value) - Math.ceil(change * 1.5));
        slider8qt.value = new8qt;
        slider16qt.value = new16qt;
        current8qt = new8qt;
        current16qt = new16qt;
        current24qt = newValue;
      }
      else if (changedSliderId === 'slider8qt' && enable8qt.checked) {
        current8qt = newValue;
      }
    } else {
      if (changedSliderId === 'slider8qt') current8qt = newValue;
      if (changedSliderId === 'slider16qt') current16qt = newValue;
      if (changedSliderId === 'slider24qt') current24qt = newValue;
    }
    
    updateMaximums();
    updateDisplayedQuantities();
  }

  function updateDisplayedQuantities() {
    qty8qt.textContent = enable8qt.checked ? slider8qt.value : '0';
    qty16qt.textContent = enable16qt.checked ? slider16qt.value : '0';
    qty24qt.textContent = enable24qt.checked ? slider24qt.value : '0';
    
    slider8qt.disabled = !enable8qt.checked;
    slider16qt.disabled = !enable16qt.checked;
    slider24qt.disabled = !enable24qt.checked;
  }

  [enable8qt, enable16qt, enable24qt].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (!checkbox.checked) {
        if (checkbox.id === 'enable8qt') {
          slider8qt.value = 0;
          current8qt = 0;
        }
        if (checkbox.id === 'enable16qt') {
          slider16qt.value = 0;
          current16qt = 0;
        }
        if (checkbox.id === 'enable24qt') {
          slider24qt.value = 0;
          current24qt = 0;
        }
      }
      updateMaximums();
      updateDisplayedQuantities();
    });
  });

  [totesInput, cuftInput].forEach(input => {
    input.addEventListener('input', () => updateSliders());
  });

  [slider8qt, slider16qt, slider24qt].forEach(slider => {
    slider.addEventListener('input', () => updateSliders(slider.id));
  });

  updateSliders();
});