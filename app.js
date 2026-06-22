// Dynamic greeting
function setGreeting() {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour >= 5 && hour < 12) greeting = 'Good morning, Bhumi ☀️';
    else if (hour >= 12 && hour < 17) greeting = 'Good afternoon, Bhumi 🌤️';
    else if (hour >= 17 && hour < 21) greeting = 'Good evening, Bhumi 🌙';
    else greeting = 'Hey night owl, Bhumi 🦉';
    document.getElementById('greeting').textContent = greeting;
  }
  
  // Dynamic date
  function setDate() {
    const date = new Date();
    const options = { weekday:'long', day:'numeric', month:'long', year:'numeric' };
    document.getElementById('date').textContent = date.toLocaleDateString('en-IN', options);
  }
  
  // Time based prompts
  function setPrompt() {
    const hour = new Date().getHours();
    let prompt = '';
    if (hour >= 5 && hour < 12) {
      prompt = '"What\'s one small thing you\'re looking forward to today?"';
    } else if (hour >= 12 && hour < 17) {
      prompt = '"How is your day going so far? Any surprises?"';
    } else if (hour >= 17 && hour < 21) {
      prompt = '"What was the best moment of your day today?"';
    } else {
      prompt = '"What\'s on your mind before you sleep tonight?"';
    }
    document.getElementById('prompt').textContent = prompt;
  }
  
  // Load and display entries
  function loadEntries() {
    const entries = JSON.parse(localStorage.getItem('huelog-entries') || '[]');
    const list = document.getElementById('entries-list');
  
    if (entries.length === 0) {
      list.innerHTML = '<p class="no-entries">No entries yet — write your first one! 🌱</p>';
      return;
    }
  
    list.innerHTML = entries.map(entry => {
      const date = new Date(entry.date);
      const dateStr = date.toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit'
      });
      return `
        <div class="entry-card">
          <div class="entry-mood">${entry.mood}</div>
          <div class="entry-content">
            <div class="entry-date">${dateStr}</div>
            <div class="entry-text">${entry.text}</div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  // Mood selection
  const moodCircles = document.querySelectorAll('.mood-circle');
  moodCircles.forEach(circle => {
    circle.addEventListener('click', () => {
      moodCircles.forEach(c => c.classList.remove('active'));
      circle.classList.add('active');
    });
  });
  
  // Save entry
  const saveBtn = document.querySelector('.save-btn');
  const writeArea = document.querySelector('.write-area');
  
  saveBtn.addEventListener('click', () => {
    const activeMood = document.querySelector('.mood-circle.active');
    const mood = activeMood ? activeMood.textContent : '😊';
    const text = writeArea.value.trim();
  
    if (!text) {
      alert('Write something first! Even one word counts 🙂');
      return;
    }
  
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: mood,
      text: text,
      type: 'write'
    };
  
    const entries = JSON.parse(localStorage.getItem('huelog-entries') || '[]');
    entries.unshift(entry);
    localStorage.setItem('huelog-entries', JSON.stringify(entries));
  
    writeArea.value = '';
    moodCircles.forEach(c => c.classList.remove('active'));
  
    // ✅ Refresh list immediately
    loadEntries();
  
    // Success feedback
    saveBtn.textContent = '✅ Saved!';
    saveBtn.style.background = '#1D9E75';
    setTimeout(() => {
      saveBtn.textContent = 'Save today\'s entry';
      saveBtn.style.background = '#7F77DD';
    }, 2000);
  });
  
  // Init
  setGreeting();
  setDate();
  setPrompt();
  loadEntries();