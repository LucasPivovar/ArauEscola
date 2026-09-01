// ==========================================
// ARAU ESCOLA - GESTÃO ESCOLAR E CHAMADA
// ==========================================

const sidebarToggle = document.querySelector('[data-menu-toggle]');
const sidebarBackdrop = document.querySelector('#sidebarBackdrop');
const passwordInput = document.querySelector('#password');
const passwordToggle = document.querySelector('#togglePassword');
const markAllButton = document.querySelector('#markAll');
const modalButtons = document.querySelectorAll('[data-modal]');
const closeButtons = document.querySelectorAll('[data-close-modal]');
const noteStudent = document.querySelector('#noteStudent');
const noteText = document.querySelector('#noteText');
const classOptionsBtn = document.querySelector('#classOptionsBtn');
const classDropdownMenu = document.querySelector('#classDropdownMenu');
const studentSearchInput = document.querySelector('#studentSearchInput');
const filterChips = document.querySelectorAll('.filter-chip');

// Directory for rich student details
const studentDirectory = {
  'Ana Clara de Lima': { initials: 'AC', birth: '14/02/2012', parent: 'Regina Célia de Lima (Mãe)', phone: '(41) 98877-1122', rate: '96%', present: 24, absent: 1, late: 0, excused: 0, obs: 'Excelente aluna, muito participativa e pontual.' },
  'Bruno Henrique Souza': { initials: 'BH', birth: '12/03/2012', parent: 'Maria de Fátima Souza (Mãe)', phone: '(41) 98765-4321', rate: '86%', present: 19, absent: 3, late: 2, excused: 1, obs: 'Aluno dedicado e participativo.' },
  'Carlos Eduardo Martins': { initials: 'CE', birth: '29/08/2011', parent: 'Roberto Martins (Pai)', phone: '(41) 99112-3344', rate: '88%', present: 20, absent: 2, late: 3, excused: 0, obs: 'Chegou após o início da aula com justificativa de trânsito.' },
  'Danielly Vitória Campos': { initials: 'DV', birth: '05/11/2012', parent: 'Solange Campos (Mãe)', phone: '(41) 99881-2233', rate: '92%', present: 22, absent: 1, late: 1, excused: 1, obs: 'Atestado médico anexado à chamada.' },
  'Eduardo Gabriel Pereira': { initials: 'EG', birth: '18/06/2012', parent: 'Gabriel Pereira (Pai)', phone: '(41) 98455-6677', rate: '94%', present: 23, absent: 1, late: 1, excused: 0, obs: 'Realizou todas as tarefas propostas em sala.' },
  'Felipe Augusto Rocha': { initials: 'FA', birth: '03/04/2012', parent: 'Vanessa Rocha (Mãe)', phone: '(41) 98711-2233', rate: '96%', present: 24, absent: 1, late: 0, excused: 0, obs: 'Sem pendências acadêmicas.' },
  'Gabriela Santos Lima': { initials: 'GS', birth: '17/07/2012', parent: 'Marcos Santos (Pai)', phone: '(41) 99655-4433', rate: '92%', present: 22, absent: 2, late: 0, excused: 1, obs: 'Ótimo rendimento em Matemática.' },
  'Giovanna Ribeiro da Silva': { initials: 'GR', birth: '22/01/2012', parent: 'Carla Ribeiro (Mãe)', phone: '(41) 99654-7890', rate: '98%', present: 24, absent: 0, late: 1, excused: 0, obs: 'Líder voluntária da turma.' },
  'Gustavo Henrique Nogueira': { initials: 'GH', birth: '30/10/2011', parent: 'Luciane Nogueira (Mãe)', phone: '(41) 98844-3322', rate: '84%', present: 18, absent: 3, late: 2, excused: 2, obs: 'Responsável notificado sobre faltas.' },
  'Helena Castro Dias': { initials: 'HC', birth: '11/05/2012', parent: 'Paulo Castro (Pai)', phone: '(41) 99122-8877', rate: '100%', present: 25, absent: 0, late: 0, excused: 0, obs: '100% de frequência no mês.' },
  'Isabela Cristina Moreira': { initials: 'IC', birth: '09/09/2012', parent: 'Cristina Moreira (Mãe)', phone: '(41) 99188-4455', rate: '92%', present: 22, absent: 2, late: 1, excused: 0, obs: 'Acompanhamento pedagógico regular.' }
};

// Toast notification helper
function notify(message) {
  let toast = document.querySelector('.toast');

  if (!toast) {
    toast = document.createElement('output');
    toast.className = 'toast';
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

// ------------------------------------------
// Sidebar open / close with click-outside
// ------------------------------------------
sidebarToggle?.addEventListener('click', (e) => {
  e.stopPropagation();
  document.body.classList.toggle('menu-open');
});

// Click outside sidebar on mobile to close it
document.addEventListener('click', (event) => {
  if (document.body.classList.contains('menu-open')) {
    const sidebar = document.querySelector('.sidebar');
    const isClickInsideSidebar = sidebar && sidebar.contains(event.target);
    const isClickOnToggle = sidebarToggle && sidebarToggle.contains(event.target);

    if (!isClickInsideSidebar && !isClickOnToggle) {
      document.body.classList.remove('menu-open');
    }
  }
});

sidebarBackdrop?.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
});

// Close sidebar on link navigation
document.querySelectorAll('.sidebar a').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
  });
});

// ------------------------------------------
// Password Visibility Toggle
// ------------------------------------------
passwordToggle?.addEventListener('click', () => {
  const hidden = passwordInput.type === 'password';
  passwordInput.type = hidden ? 'text' : 'password';
  passwordToggle.innerHTML = hidden
    ? '<i class="bi bi-eye-slash"></i>'
    : '<i class="bi bi-eye"></i>';
});

// ------------------------------------------
// Row Action Dropdown Menu in Table
// ------------------------------------------
document.addEventListener('click', (event) => {
  const menuButton = event.target.closest('[data-row-menu]');
  const clickedMenu = event.target.closest('.row-menu');

  if (menuButton) {
    const menu = menuButton.parentElement.querySelector('.row-menu');
    document.querySelectorAll('.row-menu.open').forEach((item) => {
      if (item !== menu) item.classList.remove('open');
    });
    menu?.classList.toggle('open');
    return;
  }

  if (!clickedMenu) {
    document.querySelectorAll('.row-menu.open').forEach((item) => item.classList.remove('open'));
  }
});

// ------------------------------------------
// Class Options Dropdown ("...") in turma.html
// ------------------------------------------
classOptionsBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  classDropdownMenu?.classList.toggle('open');
});

document.addEventListener('click', (event) => {
  if (classDropdownMenu?.classList.contains('open')) {
    if (!classDropdownMenu.contains(event.target) && event.target !== classOptionsBtn) {
      classDropdownMenu.classList.remove('open');
    }
  }
});

// ------------------------------------------
// Attendance Table Radios
// ------------------------------------------
document.querySelectorAll('.attendance-table tbody tr').forEach((row) => {
  row.querySelectorAll('.radio').forEach((radio) => {
    radio.addEventListener('click', () => {
      row.querySelectorAll('.radio').forEach((item) => item.classList.remove('active'));
      radio.classList.add('active');
    });
  });
});

// Mark all present button
markAllButton?.addEventListener('click', () => {
  document.querySelectorAll('.attendance-table tbody tr').forEach((row) => {
    row.querySelectorAll('.radio').forEach((item) => item.classList.remove('active'));
    row.querySelector('.radio.present')?.classList.add('active');
  });
  notify('Todos os alunos foram marcados como presentes.');
});

// ------------------------------------------
// Dynamic Student Modal Population
// ------------------------------------------
function populateStudentModal(studentName) {
  const modal = document.querySelector('#studentModal');
  if (!modal) return;

  const data = studentDirectory[studentName] || {
    initials: studentName.slice(0, 2).toUpperCase(),
    birth: '15/05/2012',
    parent: 'Responsável Cadastrado',
    phone: '(41) 99123-4567',
    rate: '92%',
    present: 23,
    absent: 2,
    late: 0,
    excused: 0,
    obs: 'Aluno com boa participação e assiduidade.'
  };

  const avatar = modal.querySelector('.student-profile .avatar');
  const nameEl = modal.querySelector('.student-profile h3');
  const birthEl = modal.querySelector('.student-profile p');
  const parentEl = modal.querySelector('.mini-card:nth-of-type(1) p');
  const phoneEl = modal.querySelector('.phone-row');
  const donutEl = modal.querySelector('.donut strong');
  const obsEl = modal.querySelector('.mini-card:last-of-type p');

  if (avatar) avatar.textContent = data.initials;
  if (nameEl) nameEl.textContent = studentName;
  if (birthEl) birthEl.textContent = `Data de nascimento: ${data.birth}`;
  if (parentEl) parentEl.textContent = data.parent;
  if (phoneEl) phoneEl.innerHTML = `<i class="bi bi-telephone-fill"></i> ${data.phone} <i class="bi bi-whatsapp"></i>`;
  if (donutEl) donutEl.textContent = data.rate;
  if (obsEl) obsEl.textContent = data.obs;

  modal.classList.add('open');
}

// ------------------------------------------
// Modals Open / Close Handlers
// ------------------------------------------
modalButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const modalSelector = button.dataset.modal;
    const modal = document.querySelector(modalSelector);
    const row = button.closest('tr');
    const studentCard = button.closest('.student-col-item') || button.closest('.student-card');
    const student = row?.querySelector('[data-student-name]')?.dataset.studentName ||
                    studentCard?.dataset.studentName ||
                    studentCard?.querySelector('h2, h3')?.textContent;

    if (modalSelector === '#studentModal' && student) {
      populateStudentModal(student);
      return;
    }

    if (student && noteStudent) noteStudent.textContent = student;
    if (student && noteText) noteText.value = '';

    document.querySelectorAll('.row-menu.open').forEach((item) => item.classList.remove('open'));
    modal?.classList.add('open');
  });
});

// Click student rows to open student modal
document.querySelectorAll('.student-col-item, .student-row').forEach((item) => {
  item.addEventListener('click', (e) => {
    // Avoid triggering if clicked on action button directly
    if (e.target.closest('button') || e.target.closest('a')) return;
    const studentName = item.dataset.studentName ||
                        item.querySelector('.student-col-main h2, .student-col-main h3')?.textContent ||
                        item.textContent.trim();
    if (studentName) populateStudentModal(studentName);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('.modal-backdrop')?.classList.remove('open');
  });
});

document.querySelectorAll('.modal-backdrop').forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.remove('open');
  });
});

// Close all popups and modals with Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.body.classList.remove('menu-open');
    document.querySelectorAll('.modal-backdrop.open').forEach((modal) => modal.classList.remove('open'));
    document.querySelectorAll('.row-menu.open').forEach((item) => item.classList.remove('open'));
    classDropdownMenu?.classList.remove('open');
  }
});

// ------------------------------------------
// Real-time Search and Filter Chips in Alunos.html
// ------------------------------------------
function filterStudents() {
  const query = studentSearchInput ? studentSearchInput.value.toLowerCase().trim() : '';
  const activeChip = document.querySelector('.filter-chip.active');
  const filterType = activeChip ? activeChip.dataset.filter : 'all';

  document.querySelectorAll('.student-col-item').forEach((item) => {
    const name = item.querySelector('.student-col-main h2, .student-col-main h3')?.textContent.toLowerCase() || '';
    const status = item.dataset.status || 'all';

    const matchesQuery = !query || name.includes(query);
    const matchesFilter = filterType === 'all' || status === filterType;

    item.style.display = matchesQuery && matchesFilter ? 'grid' : 'none';
  });
}

studentSearchInput?.addEventListener('input', filterStudents);

filterChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    filterChips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    filterStudents();
  });
});

// ------------------------------------------
// Actions Handler
// ------------------------------------------
function runAction(button) {
  const action = button.dataset.action;

  if (action === 'forgot-password') {
    notify('Link de recuperação enviado para o e-mail cadastrado.');
  }

  if (action === 'edit-class') {
    notify('Abrindo formulário de edição da turma 6º Ano A.');
    classDropdownMenu?.classList.remove('open');
  }

  if (action === 'edit-teacher-profile') {
    notify('Modo de edição do perfil do professor ativado.');
  }

  if (action === 'export-report') {
    const csv = [
      'Indicador,Valor',
      'Turma,6º Ano A',
      'Presença média,89%',
      'Total de Alunos,28',
      'Faltas no mês,11',
      'Atrasos,6',
      'Justificativas,4',
    ].join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = 'relatorio-frequencia-6A.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    notify('Relatório CSV exportado com sucesso.');
    classDropdownMenu?.classList.remove('open');
  }

  if (action === 'save-settings') {
    notify('Configurações do professor salvas com sucesso.');
  }

  if (action === 'save-note') {
    notify('Observação pedagógica registrada para o aluno.');
  }

  if (action === 'send-whatsapp') {
    button.innerHTML = '<i class="bi bi-check2-circle"></i> Notificação Enviada';
    button.style.background = '#008751';
    notify('Mensagem enviada com sucesso ao responsável via WhatsApp.');
  }

  if (action === 'view-history') {
    const date = button.closest('tr')?.querySelector('td')?.textContent || '24/05/2024';
    notify(`Abrindo detalhes da chamada de ${date}.`);
  }

  if (action === 'more-history') {
    const tbody = document.querySelector('.history-table tbody');
    const loaded = button.dataset.loaded === 'true';

    if (loaded) {
      notify('Todo o histórico disponível do bimestre já foi carregado.');
      return;
    }

    [
      ['15/05/2024', '24', '1', '0', '1'],
      ['14/05/2024', '21', '3', '2', '2'],
      ['13/05/2024', '25', '1', '1', '1'],
      ['10/05/2024', '26', '0', '1', '1'],
      ['09/05/2024', '23', '2', '2', '1'],
    ].forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[4]}</td><td><button data-action="view-history" type="button" aria-label="Ver chamada" title="Ver chamada"><i class="bi bi-eye-fill"></i></button></td>`;
      tbody?.appendChild(tr);
    });

    button.dataset.loaded = 'true';
    button.textContent = 'Histórico do bimestre carregado';
    notify('Mais 5 chamadas foram carregadas.');
  }
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (button) runAction(button);
});
