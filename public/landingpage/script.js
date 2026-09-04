// ClassConecta Landing Page Interactive Scripts
document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Shadow on Scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. Role Tab Switcher Data & Interaction
  const roleData = {
    diretor: {
      title: '👑 Visão Estratégica & Gestão Geral',
      description: 'O Diretor possui visão panorâmica e controle completo de todos os indicadores escolares em tempo real.',
      features: [
        'Dashboard com taxa de presença global da escola',
        'Ranking de alunos que exigem atenção prioritária',
        'Comparativo de desempenho entre turmas e períodos',
        'Gestão de usuários da secretaria e equipe escolar',
        'Exportação unificada de relatórios gerenciais'
      ],
      previewBadge: 'Painel da Diretoria',
      previewItems: [
        { label: 'Presença Média Geral', value: '94.2%', highlight: true },
        { label: 'Alunos em Atenção', value: '3 alunos', highlight: false },
        { label: 'Turmas Cadastradas', value: '18 turmas', highlight: false },
        { label: 'Professores Ativos', value: '24 professores', highlight: false }
      ]
    },
    secretaria: {
      title: '📋 Operação Escolar & Cadastros',
      description: 'A Secretaria gerencia matrículas, alocação de turmas e transferências com máxima agilidade e sem retrabalho.',
      features: [
        'Cadastro e enturmação rápida de alunos',
        'Importação em lote de turmas via planilhas Excel e CSV',
        'Edição retroativa de chamadas e justificativas',
        'Vinculação de professores e operadores às turmas',
        'Ficha completa do aluno com histórico e contatos'
      ],
      previewBadge: 'Secretaria Acadêmica',
      previewItems: [
        { label: 'Importação em Lote', value: 'Disponível (.csv, .xlsx)', highlight: true },
        { label: 'Matrículas no Ano', value: '540 alunos', highlight: false },
        { label: 'Histórico Retroativo', value: '100% editável', highlight: false }
      ]
    },
    professor: {
      title: '👨‍🏫 Chamada Rápida & Ocorrências em Sala',
      description: 'O Professor realiza a chamada em menos de 30 segundos, registrando presenças, faltas, atrasos e observações pedagógicas.',
      features: [
        'Acesso direto apenas às turmas vinculadas',
        'Chamada interativa com botões de 1 clique (P, F, A, J)',
        'Registro de ocorrências individuais em tempo real',
        'Linha do tempo comportamental por aluno',
        'Interface otimizada para uso no smartphone'
      ],
      previewBadge: 'Painel do Professor',
      previewItems: [
        { label: 'Turma Atual', value: '6º Ano A (Matemática)', highlight: true },
        { label: 'Chamada de Hoje', value: 'Pendente (Fazer agora)', highlight: false },
        { label: 'Presenças Confirmadas', value: '28 de 30 alunos', highlight: false }
      ]
    },
    operador: {
      title: '🔄 Cobertura de Aulas & Substituições',
      description: 'Operadores e professores substitutos realizam a chamada com permissão temporária autorizada, mantendo a frequência em dia.',
      features: [
        'Visualização restrita às turmas autorizadas para o dia',
        'Realização de chamada instantânea da aula',
        'Histórico da aula sincronizado imediatamente com a secretaria',
        'Validade de acesso temporário com controle de segurança'
      ],
      previewBadge: 'Operador / Substituto',
      previewItems: [
        { label: 'Autorização Ativa', value: 'Cobertura 7º Ano B', highlight: true },
        { label: 'Status da Chamada', value: 'Concluída às 08:15', highlight: false }
      ]
    }
  };

  const roleTabButtons = document.querySelectorAll('.role-tab-btn');
  const roleTitleEl = document.getElementById('role-title');
  const roleDescEl = document.getElementById('role-description');
  const roleFeaturesEl = document.getElementById('role-features');
  const roleBadgeEl = document.getElementById('role-preview-badge');
  const roleItemsEl = document.getElementById('role-preview-items');

  roleTabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      roleTabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const roleKey = btn.getAttribute('data-role');
      const data = roleData[roleKey];
      if (!data) return;

      if (roleTitleEl) roleTitleEl.textContent = data.title;
      if (roleDescEl) roleDescEl.textContent = data.description;
      if (roleBadgeEl) roleBadgeEl.textContent = data.previewBadge;

      if (roleFeaturesEl) {
        roleFeaturesEl.innerHTML = data.features
          .map((feat) => `<li><i class="bi bi-check-circle-fill"></i> ${feat}</li>`)
          .join('');
      }

      if (roleItemsEl) {
        roleItemsEl.innerHTML = data.previewItems
          .map(
            (item) => `
          <div class="preview-item">
            <span>${item.label}</span>
            <strong style="color: ${item.highlight ? 'var(--primary)' : 'inherit'}">${item.value}</strong>
          </div>
        `
          )
          .join('');
      }
    });
  });

  // 3. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((other) => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 4. Demonstration Modal Open / Close
  const modalBackdrop = document.getElementById('demo-modal');
  const openModalBtns = document.querySelectorAll('.js-open-demo-modal');
  const closeModalBtn = document.querySelector('.demo-modal-close');
  const demoForm = document.getElementById('demo-form');

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalBackdrop?.classList.add('is-open');
    });
  });

  closeModalBtn?.addEventListener('click', () => {
    modalBackdrop?.classList.remove('is-open');
  });

  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.classList.remove('is-open');
    }
  });

  demoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Obrigado! Entraremos em contato para agendar uma demonstração personalizada da ClassConecta.');
    modalBackdrop?.classList.remove('is-open');
  });
});
