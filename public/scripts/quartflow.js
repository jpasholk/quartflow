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

  let current8qt = 0;
  let current16qt = 0;
  let current24qt = 0;

  function calculateTotalQuarts() {
    let totes = parseFloat(totesInput.value) || 0;
    let cuft = parseFloat(cuftInput.value) || 0;
    return Math.floor(totes * cuft * 25.714);
  }

  function calculateUsedQuarts() {
    return (enable8qt.checked ? current8qt * 8 : 0) + 
           (enable16qt.checked ? current16qt * 16 : 0) + 
           (enable24qt.checked ? current24qt * 24 : 0);
  }

  function updateSliders(changedSliderId) {
    let totalQuarts = calculateTotalQuarts();
    
    if (!changedSliderId) {
      if (enable8qt.checked) slider8qt.max = Math.floor(totalQuarts / 8);
      if (enable16qt.checked) slider16qt.max = Math.floor(totalQuarts / 16);
      if (enable24qt.checked) slider24qt.max = Math.floor(totalQuarts / 24);
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
      'slider8qt': current8qt,
      'slider16qt': current16qt,
      'slider24qt': current24qt
    }[changedSliderId];

    let newValue = parseInt({
      'slider8qt': slider8qt.value,
      'slider16qt': slider16qt.value,
      'slider24qt': slider24qt.value
    }[changedSliderId]);

    let change = newValue - oldValue;

    if (changedSliderId === 'slider16qt' && enable16qt.checked) {
      current16qt = newValue;
      if (enable8qt.checked) {
        current8qt = Math.max(0, current8qt - (change * 2));
        slider8qt.value = current8qt;
      }
    } 
    else if (changedSliderId === 'slider24qt' && enable24qt.checked) {
      current24qt = newValue;
      if (enable16qt.checked) {
        current16qt = Math.max(0, current16qt - Math.ceil(change * 1.5));
        slider16qt.value = current16qt;
      }
      if (enable8qt.checked) {
        current8qt = Math.max(0, current8qt - (change * 3));
        slider8qt.value = current8qt;
      }
    }
    else if (changedSliderId === 'slider8qt' && enable8qt.checked) {
      current8qt = newValue;
    }
    
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
      updateDisplayedQuantities();
      updateSliders();
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