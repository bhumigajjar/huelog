// ── Global state ──────────────────────────────────────
let todos = [];

// ── DOM references ────────────────────────────────────
const saveBtn       = document.querySelector('.save-btn');
const writeArea     = document.querySelector('.write-area');
const moodCircles   = document.querySelectorAll('.mood-circle');
const navItems      = document.querySelectorAll('.nav-item');
const modeBtns      = document.querySelectorAll('.mode-btn');
const writeSection  = document.getElementById('write-section');
const colourSection = document.getElementById('colour-section');
const historySection= document.getElementById('history-section');
const todoInput     = document.getElementById('todo-input');

// ── Helpers ───────────────────────────────────────────
const getEntries = () =>
  JSON.parse(localStorage.getItem('huelog-entries') || '[]');

const saveEntries = (entries) =>
  localStorage.setItem('huelog-entries', JSON.stringify(entries));

const getTodayStr = () =>
  new Date().toISOString().split('T')[0];

// ── Toast ─────────────────────────────────────────────
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Greeting ──────────────────────────────────────────
function setGreeting() {
  const hour = new Date().getHours();
  let greeting = '';
  if (hour >= 5 && hour < 12)       greeting = 'Good morning, Bhumi ☀️';
  else if (hour >= 12 && hour < 17) greeting = 'Good afternoon, Bhumi 🌤️';
  else if (hour >= 17 && hour < 21) greeting = 'Good evening, Bhumi 🌙';
  else                               greeting = 'Hey night owl, Bhumi 🦉';
  document.getElementById('greeting').textContent = greeting;
}

// ── Date ──────────────────────────────────────────────
function setDate() {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  document.getElementById('date').textContent =
    new Date().toLocaleDateString('en-IN', options);
}

// ── Prompt ────────────────────────────────────────────
function setPrompt() {
  const hour = new Date().getHours();
  let prompt = '';
  if (hour >= 5 && hour < 12)       prompt = '"What\'s one small thing you\'re looking forward to today?"';
  else if (hour >= 12 && hour < 17) prompt = '"How is your day going so far? Any surprises?"';
  else if (hour >= 17 && hour < 21) prompt = '"What was the best moment of your day today?"';
  else                               prompt = '"What\'s on your mind before you sleep tonight?"';
  document.getElementById('prompt').textContent = prompt;
}

// ── Todos ─────────────────────────────────────────────
function renderTodos() {
  const list  = document.getElementById('todo-list');
  const count = document.getElementById('todo-count');
  if (!list || !count) return;

  const done = todos.filter(t => t.done).length;
  count.textContent = `${done}/${todos.length}`;
  count.style.color = (done === todos.length && todos.length > 0)
    ? '#1D9E75'
    : '#7F77DD';

  if (todos.length === 0) {
    list.innerHTML = '';
    return;
  }

  list.innerHTML = todos.map(todo => `
    <div class="todo-item">
      <div class="todo-checkbox ${todo.done ? 'checked' : ''}"
           onclick="toggleTodo('${todo.id}')">
        ${todo.done ? '✓' : ''}
      </div>
      <span class="todo-text ${todo.done ? 'done' : ''}">${todo.text}</span>
      <button class="todo-delete" onclick="deleteTodo('${todo.id}')">×</button>
    </div>
  `).join('');
}

function addTodo(text) {
  todos.push({ id: String(Date.now()), text, done: false });
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.done = !todo.done;
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  renderTodos();
}

// ── Entries ───────────────────────────────────────────
function loadEntries() {
  const entries = getEntries();
  const list    = document.getElementById('entries-list');

  if (entries.length === 0) {
    list.innerHTML = '<p class="no-entries">No entries yet — write your first one! 🌱</p>';
    return;
  }

  list.innerHTML = entries.map(entry => {
    const dateStr = new Date(entry.date).toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit',
    });

    const todosHTML = entry.todos?.length > 0
      ? `<div class="entry-todos">
          ${entry.todos.map(t => `
            <div class="entry-todo-item">
              <span class="entry-todo-check">${t.done ? '✅' : '⬜'}</span>
              <span class="${t.done ? 'entry-todo-done' : ''}">${t.text}</span>
            </div>
          `).join('')}
         </div>`
      : '';

      const mandalaHTML = entry.mandala
      ? `<div class="entry-mandala">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
            <circle cx="200" cy="200" r="190" fill="#FDFCFA" stroke="#E8E4DC" stroke-width="2"/>
            ${[0,45,90,135,180,225,270,315].map((r,i) => `
              <path d="M200,28 C216,70 216,118 200,138 C184,118 184,70 200,28Z"
                fill="${entry.mandala['r5-'+i] || '#F7F3EE'}"
                stroke="#2C2A26" stroke-width="2"
                transform="rotate(${r} 200 200)"/>
            `).join('')}
            ${[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map((r,i) => `
              <circle cx="200" cy="50" r="9"
                fill="${entry.mandala['r4-'+i] || '#F7F3EE'}"
                stroke="#2C2A26" stroke-width="2"
                transform="rotate(${r} 200 200)"/>
            `).join('')}
            ${[0,45,90,135,180,225,270,315].map((r,i) => `
              <path d="M200,142 C212,158 212,178 200,188 C188,178 188,158 200,142Z"
                fill="${entry.mandala['r3-'+i] || '#F7F3EE'}"
                stroke="#2C2A26" stroke-width="2"
                transform="rotate(${r} 200 200)"/>
            `).join('')}
            ${[0,45,90,135,180,225,270,315].map((r,i) => `
              <path d="M200,188 L208,200 L200,212 L192,200Z"
                fill="${entry.mandala['r2-'+i] || '#F7F3EE'}"
                stroke="#2C2A26" stroke-width="2"
                transform="rotate(${r} 200 200)"/>
            `).join('')}
            <circle cx="200" cy="200" r="20"
              fill="${entry.mandala['centre'] || '#F7F3EE'}"
              stroke="#2C2A26" stroke-width="2"/>
          </svg>
        </div>`
      : '';

    return `
      <div class="entry-card" id="entry-${entry.id}">
        <div class="entry-mood">${entry.mood}</div>
        <div class="entry-content">
          <div class="entry-date">${dateStr}</div>
          <div class="entry-text" id="text-${entry.id}">${entry.text}</div>
          ${todosHTML}
          ${mandalaHTML}
        </div>
        <div class="entry-actions">
          <button class="edit-btn"   onclick="editEntry(${entry.id})">✏️</button>
          <button class="delete-btn" onclick="deleteEntry(${entry.id})">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function deleteEntry(id) {
  saveEntries(getEntries().filter(e => e.id !== id));
  loadEntries();
}

function editEntry(id) {
  const entries = getEntries();
  const entry   = entries.find(e => e.id === id);
  if (!entry) return;

  const textEl = document.getElementById(`text-${id}`);

  const todosEditHTML = entry.todos?.length > 0
    ? `<div class="entry-todos edit-todos">
        ${entry.todos.map((t, i) => `
          <div class="entry-todo-item">
            <div class="todo-checkbox ${t.done ? 'checked' : ''}"
                 onclick="toggleSavedTodo(${id}, ${i})">
              ${t.done ? '✓' : ''}
            </div>
            <span class="${t.done ? 'entry-todo-done' : ''}">${t.text}</span>
          </div>
        `).join('')}
       </div>`
    : '';

  textEl.innerHTML = `
    <textarea class="edit-area" id="edit-${id}">${entry.text}</textarea>
    ${todosEditHTML}
    <div class="edit-actions">
      <button class="save-edit-btn"   onclick="saveEdit(${id})">Save</button>
      <button class="cancel-edit-btn" onclick="loadEntries()">Cancel</button>
    </div>
  `;

  document.getElementById(`edit-${id}`).focus();
}

function saveEdit(id) {
  const newText = document.getElementById(`edit-${id}`).value.trim();
  if (!newText) return;

  const entries = getEntries();
  const index   = entries.findIndex(e => e.id === id);
  entries[index].text   = newText;
  entries[index].edited = true;
  saveEntries(entries);
  loadEntries();
}

function toggleSavedTodo(entryId, todoIndex) {
  const entries    = getEntries();
  const entryIndex = entries.findIndex(e => e.id === entryId);
  if (entryIndex === -1) return;
  entries[entryIndex].todos[todoIndex].done =
    !entries[entryIndex].todos[todoIndex].done;
  saveEntries(entries);
  editEntry(entryId);
}

// ── Save entry ────────────────────────────────────────
function saveEntry() {
  const activeMood = document.querySelector('.mood-circle.active');
  const mood       = activeMood ? activeMood.textContent : '😊';
  const text       = writeArea.value.trim();

  if (!text) {
    alert('Write something first! Even one word counts 🙂');
    return;
  }

  const entries    = getEntries();
  const todayStr   = getTodayStr();
  const todayIndex = entries.findIndex(e => e.date.split('T')[0] === todayStr);

  if (todayIndex !== -1) {
    entries[todayIndex].text      = text;
    entries[todayIndex].mood      = mood;
    entries[todayIndex].todos     = todos.slice();
    entries[todayIndex].updatedAt = new Date().toISOString();
    showToast('✏️ Today\'s entry updated! Check History tab 🙂');
  } else {
    entries.unshift({
      id:    Date.now(),
      date:  new Date().toISOString(),
      mood,
      text,
      todos: todos.slice(),
      type:  'write',
    });
    showToast('✅ Entry saved! Check History tab to see it 🎉');
  }

  saveEntries(entries);
  writeArea.value = '';
  moodCircles.forEach(c => c.classList.remove('active'));
  todos = [];
  renderTodos();
  loadEntries();

  saveBtn.textContent        = '✅ Saved!';
  saveBtn.style.background   = '#1D9E75';
  setTimeout(() => {
    saveBtn.textContent      = 'Update today\'s entry';
    saveBtn.style.background = '#7F77DD';
  }, 2000);
}

// ── Check today's entry on load ───────────────────────
function checkTodayEntry() {
  const todayEntry = getEntries().find(e => e.date.split('T')[0] === getTodayStr());
  if (!todayEntry) return;

  saveBtn.textContent = 'Update today\'s entry';
  writeArea.value     = todayEntry.text;
  moodCircles.forEach(c => {
    if (c.textContent === todayEntry.mood) c.classList.add('active');
  });
  todos = todayEntry.todos || [];
  renderTodos();
}

// ── Streak ────────────────────────────────────────────
function calculateStreak() {
  const entries = getEntries();
  if (entries.length === 0) return 0;

  const uniqueDates = [...new Set(entries.map(e => e.date.split('T')[0]))]
    .sort()
    .reverse();

  let streak    = 0;
  const today   = new Date();

  for (let i = 0; i < uniqueDates.length; i++) {
    const expected    = new Date(today);
    expected.setDate(today.getDate() - i);
    const expectedStr = expected.toISOString().split('T')[0];
    if (uniqueDates[i] === expectedStr) streak++;
    else break;
  }

  return streak;
}

function showStreak() {
  const el = document.getElementById('streak-count');
  if (el) el.textContent = calculateStreak();
}

// ── Mandala ───────────────────────────────────────────
const mandalaState = {
  selectedColour: '#7F77DD',
  sections:       new Map(),
  history:        [],
};

async function loadMandala() {
  try {
    const response  = await fetch('mandala.svg');
    const svgText   = await response.text();
    const container = document.getElementById('mandala-container');
    if (!container) return;
    container.innerHTML = svgText;
    initMandala();
  } catch (error) {
    console.error('Could not load mandala:', error);
  }
}

function initMandala() {
  const svg = document.getElementById('mandala-svg');
  if (!svg) return;

  // Restore saved state
  loadMandalaState();

  // Event delegation — one listener for all sections
  svg.addEventListener('click', e => {
    const section = e.target.closest('.m-section');
    if (!section) return;

    const id        = section.dataset.id;
    const prevColour= mandalaState.sections.get(id) || '#F7F3EE';

    // Push to history for undo
    mandalaState.history.push({ id, prevColour });

    const newColour = mandalaState.selectedColour === 'eraser'
      ? '#F7F3EE'
      : mandalaState.selectedColour;

    mandalaState.sections.set(id, newColour);
    section.setAttribute('fill', newColour);
  });
}

function loadMandalaState() {
  const svg        = document.getElementById('mandala-svg');
  const todayEntry = getEntries().find(e => e.date.split('T')[0] === getTodayStr());
  if (!todayEntry?.mandala || !svg) return;

  Object.entries(todayEntry.mandala).forEach(([id, colour]) => {
    mandalaState.sections.set(id, colour);
    const section = svg.querySelector(`[data-id="${id}"]`);
    if (section) section.setAttribute('fill', colour);
  });
}

// ── Mode toggle ───────────────────────────────────────
function switchMode(mode, navIndex) {
  navItems.forEach(n => n.classList.remove('active'));
  navItems[navIndex].classList.add('active');

  modeBtns.forEach(b => b.classList.remove('active'));
  if (navIndex < 3) modeBtns[navIndex].classList.add('active');

  writeSection.classList.toggle('hidden',   mode !== 'write');
  colourSection.classList.toggle('hidden',  mode !== 'colour');
  historySection.classList.toggle('hidden', mode !== 'history');

  if (mode === 'history') {
    loadEntries();
    showStreak();
  }

  if (mode === 'colour') {
    loadMandala();
  }
}

function switchToColour() {
  switchMode('colour', 1);
}

// ── Event listeners ───────────────────────────────────
moodCircles.forEach(circle => {
  circle.addEventListener('click', () => {
    moodCircles.forEach(c => c.classList.remove('active'));
    circle.classList.add('active');
  });
});

modeBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    switchMode(btn.textContent.trim().toLowerCase(), index);
  });
});

if (todoInput) {
  todoInput.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const text = todoInput.value.trim();
    if (!text) return;
    addTodo(text);
    todoInput.value = '';
  });
}

saveBtn.addEventListener('click', saveEntry);

// Colour palette
const colourPalette = document.getElementById('colour-palette');
if (colourPalette) {
  colourPalette.addEventListener('click', e => {
    const dot = e.target.closest('.colour-dot');
    if (!dot) return;
    document.querySelectorAll('.colour-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    mandalaState.selectedColour = dot.dataset.colour;
  });
}

// Undo
const undoBtn = document.getElementById('undo-btn');
if (undoBtn) {
  undoBtn.addEventListener('click', () => {
    if (mandalaState.history.length === 0) return;
    const { id, prevColour } = mandalaState.history.pop();
    mandalaState.sections.set(id, prevColour);
    const section = document.querySelector(`[data-id="${id}"]`);
    if (section) section.setAttribute('fill', prevColour);
  });
}

// Reset
const resetBtn = document.getElementById('reset-btn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    mandalaState.sections.clear();
    mandalaState.history = [];
    document.querySelectorAll('.m-section').forEach(s => {
      s.setAttribute('fill', '#F7F3EE');
    });
  });
}

// Save mandala as entry
const mandalaSaveBtn = document.getElementById('mandala-save-btn');
if (mandalaSaveBtn) {
  mandalaSaveBtn.addEventListener('click', () => {
    if (mandalaState.sections.size === 0) {
      showToast('Colour something first! 🎨');
      return;
    }

    const entries    = getEntries();
    const todayStr   = getTodayStr();
    const todayIndex = entries.findIndex(e => e.date.split('T')[0] === todayStr);
    const mandalaData= Object.fromEntries(mandalaState.sections);

    if (todayIndex !== -1) {
      entries[todayIndex].mandala   = mandalaData;
      entries[todayIndex].type      = 'colour';
      entries[todayIndex].updatedAt = new Date().toISOString();
      showToast('✏️ Mandala updated in today\'s entry! 🎨');
    } else {
      entries.unshift({
        id:      Date.now(),
        date:    new Date().toISOString(),
        mood:    '🎨',
        text:    'Coloured a mandala today',
        mandala: mandalaData,
        todos:   [],
        type:    'colour',
      });
      showToast('✅ Mandala saved as today\'s entry! 🎨');
    }

    saveEntries(entries);
    loadEntries();
  });
}

// ── Init ──────────────────────────────────────────────
setGreeting();
setDate();
setPrompt();
loadEntries();
renderTodos();
showStreak();
checkTodayEntry();