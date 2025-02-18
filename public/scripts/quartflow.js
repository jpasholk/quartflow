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
  const resetButton = document.getElementById('resetCalculator');

  // Add progress bar elements to DOM references
  const progress8qt = document.getElementById('progress8qt');
  const progress16qt = document.getElementById('progress16qt');
  const progress24qt = document.getElementById('progress24qt');

  let current8qt = 0;
  let current16qt = 0;
  let current24qt = 0;

  // Get constants from data attribute
  const calculator = document.getElementById('quartCalculator');
  const QUART_CONSTANTS = JSON.parse(calculator.dataset.constants);

  // Use constants in calculations
  function calculateTotalQuarts() {
    let totes = parseFloat(totesInput.value) || 0;
    let cuft = parseFloat(cuftInput.value) || 0;
    return Math.floor(totes * cuft * QUART_CONSTANTS.quartsPerCubicFoot);
  }

  function updateMaximums() {
    let totalQuarts = calculateTotalQuarts();
    let remainingQuarts = totalQuarts - (
      current8qt * QUART_CONSTANTS.sizes.small + 
      current16qt * QUART_CONSTANTS.sizes.medium + 
      current24qt * QUART_CONSTANTS.sizes.large
    );

    if (enable8qt.checked) {
      let max8qtValue = Math.floor(remainingQuarts / QUART_CONSTANTS.sizes.small) + current8qt;
      slider8qt.max = max8qtValue;
      max8qt.textContent = max8qtValue;
    }

    if (enable16qt.checked) {
      let max16qtValue = Math.floor(remainingQuarts / QUART_CONSTANTS.sizes.medium) + current16qt;
      slider16qt.max = max16qtValue;
      max16qt.textContent = max16qtValue;
    }

    if (enable24qt.checked) {
      let max24qtValue = Math.floor(remainingQuarts / QUART_CONSTANTS.sizes.large) + current24qt;
      slider24qt.max = max24qtValue;
      max24qt.textContent = max24qtValue;
    }
  }

  function updateSliders(changedSliderId) {
    let totalQuarts = calculateTotalQuarts();
    
    if (!changedSliderId) {
      slider8qt.max = Math.floor(totalQuarts / QUART_CONSTANTS.sizes.small);
      slider16qt.max = Math.floor(totalQuarts / QUART_CONSTANTS.sizes.medium);
      slider24qt.max = Math.floor(totalQuarts / QUART_CONSTANTS.sizes.large);
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

  function updateProgressBars() {
    if (enable8qt.checked) {
        const remainingPercent8qt = ((parseInt(slider8qt.max) - current8qt) / parseInt(slider8qt.max)) * 100;
        progress8qt.value = Math.floor(remainingPercent8qt);
    } else {
        progress8qt.value = 100;
    }

    if (enable16qt.checked) {
        const remainingPercent16qt = ((parseInt(slider16qt.max) - current16qt) / parseInt(slider16qt.max)) * 100;
        progress16qt.value = Math.floor(remainingPercent16qt);
    } else {
        progress16qt.value = 100;
    }

    if (enable24qt.checked) {
        const remainingPercent24qt = ((parseInt(slider24qt.max) - current24qt) / parseInt(slider24qt.max)) * 100;
        progress24qt.value = Math.floor(remainingPercent24qt);
    } else {
        progress24qt.value = 100;
    }
}

  function updateDisplayedQuantities() {
    if (enable8qt.checked) {
      qty8qt.value = slider8qt.value;
    } else {
      qty8qt.value = '0';
    }
    
    if (enable16qt.checked) {
      qty16qt.value = slider16qt.value;
    } else {
      qty16qt.value = '0';
    }
    
    if (enable24qt.checked) {
      qty24qt.value = slider24qt.value;
    } else {
      qty24qt.value = '0';
    }
    
    slider8qt.disabled = !enable8qt.checked;
    slider16qt.disabled = !enable16qt.checked;
    slider24qt.disabled = !enable24qt.checked;
    
    qty8qt.disabled = !enable8qt.checked;
    qty16qt.disabled = !enable16qt.checked;
    qty24qt.disabled = !enable24qt.checked;

    updateProgressBars();
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

  function handleInputChange(input, slider, currentValue) {
    let value = parseInt(input.value) || 0;
    let max = parseInt(slider.max) || 0;
    value = Math.min(value, max);
    
    input.value = value;
    slider.value = value;
    
    if (input.id === 'qty8qt') current8qt = value;
    if (input.id === 'qty16qt') current16qt = value;
    if (input.id === 'qty24qt') current24qt = value;
    
    updateMaximums();
    updateDisplayedQuantities();
  }

  // Add input event listeners
  qty8qt.addEventListener('input', () => handleInputChange(qty8qt, slider8qt, current8qt));
  qty16qt.addEventListener('input', () => handleInputChange(qty16qt, slider16qt, current16qt));
  qty24qt.addEventListener('input', () => handleInputChange(qty24qt, slider24qt, current24qt));

  // Update slider event listeners
  [slider8qt, slider16qt, slider24qt].forEach(slider => {
    slider.addEventListener('input', (e) => {
      if (e.target.id === 'slider8qt') qty8qt.value = e.target.value;
      if (e.target.id === 'slider16qt') qty16qt.value = e.target.value;
      if (e.target.id === 'slider24qt') qty24qt.value = e.target.value;
      updateSliders(e.target.id);
    });
  });

  function resetCalculator() {
    // Reset input values
    totesInput.value = '1';
    cuftInput.value = '62';

    // Reset checkboxes
    enable8qt.checked = false;
    enable16qt.checked = false;
    enable24qt.checked = false;

    // Reset sliders and current values
    slider8qt.value = '0';
    slider16qt.value = '0';
    slider24qt.value = '0';
    current8qt = 0;
    current16qt = 0;
    current24qt = 0;

    // Update UI
    updateMaximums();
    updateDisplayedQuantities();

    progress8qt.value = 0;
    progress16qt.value = 0;
    progress24qt.value = 0;
  }

  // Add reset button event listener
  resetButton.addEventListener('click', resetCalculator);

  updateSliders();
});