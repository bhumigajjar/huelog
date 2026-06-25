// ── Global state ──────────────────────────────────────
var todos = [];

// ── Greeting ──────────────────────────────────────────
function setGreeting() {
  const hour = new Date().getHours();
  let greeting = '';
  if (hour >= 5 && hour < 12) greeting = 'Good morning, Bhumi ☀️';
  else if (hour >= 12 && hour < 17) greeting = 'Good afternoon, Bhumi 🌤️';
  else if (hour >= 17 && hour < 21) greeting = 'Good evening, Bhumi 🌙';
  else greeting = 'Hey night owl, Bhumi 🦉';
  document.getElementById('greeting').textContent = greeting;
}

// ── Date ──────────────────────────────────────────────
function setDate() {
  const date = new Date();
  const options = { weekday:'long', day:'numeric', month:'long', year:'numeric' };
  document.getElementById('date').textContent = date.toLocaleDateString('en-IN', options);
}

// ── Prompt ────────────────────────────────────────────
function setPrompt() {
  const hour = new Date().getHours();
  let prompt = '';
  if (hour >= 5 && hour < 12) prompt = '"What\'s one small thing you\'re looking forward to today?"';
  else if (hour >= 12 && hour < 17) prompt = '"How is your day going so far? Any surprises?"';
  else if (hour >= 17 && hour < 21) prompt = '"What was the best moment of your day today?"';
  else prompt = '"What\'s on your mind before you sleep tonight?"';
  document.getElementById('prompt').textContent = prompt;
}

// ── Todos ─────────────────────────────────────────────
function renderTodos() {
  var list = document.getElementById('todo-list');
  var count = document.getElementById('todo-count');
  if (!list || !count) return;
  var done = todos.filter(function(t) { return t.done; }).length;
  count.textContent = done + '/' + todos.length;
  count.style.color = (done === todos.length && todos.length > 0) ? '#1D9E75' : '#7F77DD';
  if (todos.length === 0) { list.innerHTML = ''; return; }
  list.innerHTML = todos.map(function(todo) {
    return '<div class="todo-item">' +
      '<div class="todo-checkbox ' + (todo.done ? 'checked' : '') + '" onclick="toggleTodo(\'' + todo.id + '\')">' +
      (todo.done ? '✓' : '') +
      '</div>' +
      '<span class="todo-text ' + (todo.done ? 'done' : '') + '">' + todo.text + '</span>' +
      '<button class="todo-delete" onclick="deleteTodo(\'' + todo.id + '\')">×</button>' +
      '</div>';
  }).join('');
}

function addTodo(text) {
  todos.push({ id: String(Date.now()), text: text, done: false });
  renderTodos();
}

function toggleTodo(id) {
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].id === id) { todos[i].done = !todos[i].done; break; }
  }
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(function(t) { return t.id !== id; });
  renderTodos();
}

// ── Entries ───────────────────────────────────────────
function loadEntries() {
    var entries = JSON.parse(localStorage.getItem('huelog-entries') || '[]');
  var list = document.getElementById('entries-list');
  if (entries.length === 0) {
    list.innerHTML = '<p class="no-entries">No entries yet — write your first one! 🌱</p>';
    return;
  }
    list.innerHTML = entries.map(function(entry) {
        var date = new Date(entry.date);
        var dateStr = date.toLocaleDateString('en-IN', {
          weekday: 'short', day: 'numeric', month: 'short',
          hour: '2-digit', minute: '2-digit'
        });
      
        var todosHTML = '';
        if (entry.todos && entry.todos.length > 0) {
          todosHTML = '<div class="entry-todos">' +
            entry.todos.map(function(t) {
              return '<div class="entry-todo-item">' +
                '<span class="entry-todo-check">' + (t.done ? '✅' : '⬜') + '</span>' +
                '<span class="' + (t.done ? 'entry-todo-done' : '') + '">' + t.text + '</span>' +
                '</div>';
            }).join('') +
          '</div>';
        }
      
        return '<div class="entry-card" id="entry-' + entry.id + '">' +
          '<div class="entry-mood">' + entry.mood + '</div>' +
          '<div class="entry-content">' +
          '<div class="entry-date">' + dateStr + '</div>' +
          '<div class="entry-text" id="text-' + entry.id + '">' + entry.text + '</div>' +
          todosHTML +
          '</div>' +
          '<div class="entry-actions">' +
          '<button class="edit-btn" onclick="editEntry(' + entry.id + ')">✏️</button>' +
          '<button class="delete-btn" onclick="deleteEntry(' + entry.id + ')">🗑️</button>' +
          '</div>' +
          '</div>';
      }).join('');
}

function deleteEntry(id) {
  var entries = JSON.parse(localStorage.getItem('huelog-entries') || '[]');
  var updated = entries.filter(function(e) { return e.id !== id; });
  localStorage.setItem('huelog-entries', JSON.stringify(updated));
  loadEntries();
}

function editEntry(id) {
    var entries = JSON.parse(localStorage.getItem('huelog-entries') || '[]');
    var entry = entries.find(function(e) { return e.id === id; });
    if (!entry) return;
    var textEl = document.getElementById('text-' + id);
  
    var todosEditHTML = '';
    if (entry.todos && entry.todos.length > 0) {
      todosEditHTML = '<div class="entry-todos edit-todos">' +
        entry.todos.map(function(t, i) {
          return '<div class="entry-todo-item">' +
            '<div class="todo-checkbox ' + (t.done ? 'checked' : '') + '" onclick="toggleSavedTodo(' + id + ',' + i + ')">' +
            (t.done ? '✓' : '') +
            '</div>' +
            '<span class="' + (t.done ? 'entry-todo-done' : '') + '">' + t.text + '</span>' +
            '</div>';
        }).join('') +
      '</div>';
    }
  
    textEl.innerHTML = '<textarea class="edit-area" id="edit-' + id + '">' + entry.text + '</textarea>' +
      todosEditHTML +
      '<div class="edit-actions">' +
      '<button class="save-edit-btn" onclick="saveEdit(' + id + ')">Save</button>' +
      '<button class="cancel-edit-btn" onclick="loadEntries()">Cancel</button>' +
      '</div>';
  
    document.getElementById('edit-' + id).focus();
  }

function saveEdit(id) {
  var newText = document.getElementById('edit-' + id).value.trim();
  if (!newText) return;
  var entries = JSON.parse(localStorage.getItem('huelog-entries') || '[]');
  var index = entries.findIndex(function(e) { return e.id === id; });
  entries[index].text = newText;
  entries[index].edited = true;
  localStorage.setItem('huelog-entries', JSON.stringify(entries));
  loadEntries();
}

// ── Mood selection ────────────────────────────────────
var moodCircles = document.querySelectorAll('.mood-circle');
moodCircles.forEach(function(circle) {
  circle.addEventListener('click', function() {
    moodCircles.forEach(function(c) { c.classList.remove('active'); });
    circle.classList.add('active');
  });
});

// ── Todo input ────────────────────────────────────────
var todoInput = document.getElementById('todo-input');
todoInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    var text = todoInput.value.trim();
    if (!text) return;
    addTodo(text);
    todoInput.value = '';
  }
});

// ── Save entry ────────────────────────────────────────
var saveBtn = document.querySelector('.save-btn');
var writeArea = document.querySelector('.write-area');

saveBtn.addEventListener('click', function() {
    var activeMood = document.querySelector('.mood-circle.active');
    var mood = activeMood ? activeMood.textContent : '😊';
    var text = writeArea.value.trim();
  
    if (!text) {
      alert('Write something first! Even one word counts 🙂');
      return;
    }
  
    var entries = JSON.parse(localStorage.getItem('huelog-entries') || '[]');
  
    // Check if entry exists for today
    var todayStr = new Date().toISOString().split('T')[0];
    var todayIndex = entries.findIndex(function(e) {
      return e.date.split('T')[0] === todayStr;
    });
  
    if (todayIndex !== -1) {
      // UPDATE today's existing entry
      entries[todayIndex].text = text;
      entries[todayIndex].mood = mood;
      entries[todayIndex].todos = window.todos.slice();
      entries[todayIndex].updatedAt = new Date().toISOString();
      showToast('✏️ Today\'s entry updated! Check History tab 🙂');
    } else {
      // CREATE new entry for today
      var entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        mood: mood,
        text: text,
        todos: window.todos.slice(),
        type: 'write'
      };
      entries.unshift(entry);
      showToast('✅ Entry saved! Check History tab to see it 🎉');
    }
  
    localStorage.setItem('huelog-entries', JSON.stringify(entries));
  
    writeArea.value = '';
    moodCircles.forEach(function(c) { c.classList.remove('active'); });
    window.todos = [];
    renderTodos();
    loadEntries();
  
    saveBtn.textContent = '✅ Saved!';
    saveBtn.style.background = '#1D9E75';
    setTimeout(function() {
      saveBtn.textContent = 'Save today\'s entry';
      saveBtn.style.background = '#7F77DD';
    }, 2000);
});
// Check if today already has entry and update button
function checkTodayEntry() {
    var entries = JSON.parse(localStorage.getItem('huelog-entries') || '[]');
    var todayStr = new Date().toISOString().split('T')[0];
    var todayEntry = entries.find(function(e) {
      return e.date.split('T')[0] === todayStr;
    });
  
    if (todayEntry) {
      saveBtn.textContent = 'Update today\'s entry';
      // Pre-fill with existing content
      writeArea.value = todayEntry.text;
      // Pre-select mood
      moodCircles.forEach(function(c) {
        if (c.textContent === todayEntry.mood) {
          c.classList.add('active');
        }
      });
      // Pre-fill todos
      window.todos = todayEntry.todos || [];
      renderTodos();
    }
  }
function toggleSavedTodo(entryId, todoIndex) {
    var entries = JSON.parse(localStorage.getItem('huelog-entries') || '[]');
    var entryIndex = entries.findIndex(function(e) { return e.id === entryId; });
    if (entryIndex === -1) return;
    entries[entryIndex].todos[todoIndex].done = !entries[entryIndex].todos[todoIndex].done;
    localStorage.setItem('huelog-entries', JSON.stringify(entries));
    editEntry(entryId);
}
// Mode toggle
// All sections
var writeSection = document.getElementById('write-section');
var colourSection = document.getElementById('colour-section');
var historySection = document.getElementById('history-section');

// Nav items
var navItems = document.querySelectorAll('.nav-item');
var modeBtns = document.querySelectorAll('.mode-btn');

function switchMode(mode, navIndex) {
  // Update bottom nav
  navItems.forEach(function(n) { n.classList.remove('active'); });
  navItems[navIndex].classList.add('active');

  // Update mode toggle buttons
  modeBtns.forEach(function(b) { b.classList.remove('active'); });
  if (navIndex < 3) modeBtns[navIndex].classList.add('active');

  // Show correct section
  writeSection.style.display = mode === 'write' ? 'block' : 'none';
  colourSection.style.display = mode === 'colour' ? 'block' : 'none';
  historySection.style.display = mode === 'history' ? 'block' : 'none';

  // Load entries when switching to history
  if (mode === 'history') {
    loadEntries();
    showStreak(); 
  }}

// Mode toggle buttons
modeBtns.forEach(function(btn, index) {
  btn.addEventListener('click', function() {
    var mode = btn.textContent.trim().toLowerCase();
    switchMode(mode, index);
  });
});

// Mandala shortcut card
function switchToColour() {
  switchMode('colour', 1);
}

// Streak counter
function calculateStreak() {
    var entries = JSON.parse(localStorage.getItem('huelog-entries') || '[]');
    
    if (entries.length === 0) return 0;
  
    // Get unique dates only (YYYY-MM-DD format)
    var dates = entries.map(function(e) {
      return e.date.split('T')[0];
    });
    var uniqueDates = [...new Set(dates)].sort().reverse();
    // ['2026-06-25', '2026-06-24', '2026-06-23', ...]
  
    // Check consecutive days from today
    var streak = 0;
    var today = new Date();
  
    for (var i = 0; i < uniqueDates.length; i++) {
      var expected = new Date(today);
      expected.setDate(today.getDate() - i);
      var expectedStr = expected.toISOString().split('T')[0];
  
      if (uniqueDates[i] === expectedStr) {
        streak++;
      } else {
        break; // streak broken!
      }
    }
  
    return streak;
  }
  
  // Display streak
  function showStreak() {
    var streak = calculateStreak();
    var streakEl = document.getElementById('streak-count');
    if (streakEl) {
      streakEl.textContent = streak;
    }
  }
  // Toast notification
function showToast(message) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function() {
      toast.classList.remove('show');
    }, 2500);
  }
// ── Init ──────────────────────────────────────────────
setGreeting();
setDate();
setPrompt();
loadEntries();
renderTodos();
showStreak();
checkTodayEntry(); 