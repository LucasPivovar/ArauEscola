'use client';

import { useState } from 'react';
import {
  Bell,
  BookOpenCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  Gift,
  GraduationCap,
  House,
  LogOut,
  Mail,
  MessageCircle,
  MoreVertical,
  PieChart,
  Play,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  X,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const classes = [
  {
    grade: '6º A',
    school: 'Escola Municipal Professora Helena Kolody',
    students: 28,
    period: 'Manhã (07:30 - 11:30)',
    color: 'teal',
  },
  {
    grade: '7º B',
    school: 'Escola Municipal Professor Antônio dos Santos',
    students: 26,
    period: 'Tarde (13:00 - 17:00)',
    color: 'blue',
  },
  {
    grade: '8º A',
    school: 'Escola Municipal Tiradentes',
    students: 27,
    period: 'Manhã (07:30 - 11:30)',
    color: 'teal',
  },
];

const studentsList = [
  { name: 'Ana Clara de Lima', status: 'present', rate: '96%', parent: 'Regina Célia de Lima', phone: '(41) 98877-1122' },
  { name: 'Bruno Henrique Souza', status: 'absent', rate: '86%', parent: 'Maria de Fátima Souza', phone: '(41) 98765-4321' },
  { name: 'Carlos Eduardo Martins', status: 'late', rate: '88%', parent: 'Roberto Martins', phone: '(41) 99112-3344' },
  { name: 'Danielly Vitória Campos', status: 'excused', rate: '92%', parent: 'Solange Campos', phone: '(41) 99881-2233' },
  { name: 'Eduardo Gabriel Pereira', status: 'present', rate: '94%', parent: 'Gabriel Pereira', phone: '(41) 98455-6677' },
  { name: 'Giovanna Ribeiro da Silva', status: 'present', rate: '98%', parent: 'Carla Ribeiro', phone: '(41) 99654-7890' },
  { name: 'Isabela Cristina Moreira', status: 'present', rate: '92%', parent: 'Cristina Moreira', phone: '(41) 99188-4455' },
];

const history = [
  ['24/05/2024', 22, 3, 2, 1],
  ['23/05/2024', 24, 1, 1, 2],
  ['22/05/2024', 20, 4, 1, 3],
  ['21/05/2024', 21, 3, 2, 2],
  ['20/05/2024', 19, 4, 2, 1],
  ['17/05/2024', 23, 2, 1, 2],
  ['16/05/2024', 22, 3, 1, 1],
];

const menuItems = [
  [House, 'Início'],
  [Gift, 'Minhas Turmas'],
  [BookOpenCheck, 'Chamada'],
  [Clock3, 'Histórico'],
  [UsersRound, 'Alunos'],
  [PieChart, 'Relatórios'],
  [Mail, 'Mensagens'],
  [Settings, 'Configurações'],
];

function Mark({ active, tone }: { active?: boolean; tone: string }) {
  return (
    <span className={`mark mark-${tone} ${active ? 'is-active' : ''}`}>
      {active ? <Check size={13} strokeWidth={3} /> : null}
    </span>
  );
}

export default function Home() {
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <main className="school-app">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast show" style={{ opacity: 1, transform: 'translate(-50%, 0)' }}>
          {toastMessage}
        </div>
      )}

      {/* Teacher Profile Modal */}
      {showTeacherModal && (
        <div className="modal-backdrop open" onClick={() => setShowTeacherModal(false)}>
          <section className="modal-card teacher-modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="modal-title">
              <h2>Perfil do Professor</h2>
              <button className="icon-btn" onClick={() => setShowTeacherModal(false)} type="button">
                <X size={18} />
              </button>
            </header>

            <div className="teacher-profile-header">
              <div className="teacher-profile-avatar">LS</div>
              <div className="teacher-profile-info">
                <h3>Prof. Lucas Silva</h3>
                <p className="teacher-subject"><BookOpenCheck size={16} /> Professor de Matemática</p>
                <p className="teacher-meta"><Building size={14} /> Matrícula: <strong>2024.0891-PR</strong></p>
                <p className="teacher-meta">Secretaria Municipal de Educação de Araucária</p>
              </div>
            </div>

            <div className="teacher-contact-card card">
              <h4>Dados de Contato e Vínculo</h4>
              <div className="teacher-contact-grid">
                <div><span>E-mail institucional:</span><strong>lucas.silva@araucaria.pr.gov.br</strong></div>
                <div><span>WhatsApp / Telefone:</span><strong>(41) 99123-4567</strong></div>
                <div><span>Formação:</span><strong>Licenciatura em Matemática (UFPR)</strong></div>
                <div><span>Carga horária:</span><strong>40h semanais (Regime Estatutário)</strong></div>
              </div>
            </div>

            <div className="teacher-classes-section">
              <h4><Gift size={16} /> Turmas que Leciona ({classes.length})</h4>
              <div className="teacher-classes-list">
                {classes.map((cls) => (
                  <article className="teacher-class-item" key={cls.grade}>
                    <div className={`t-badge ${cls.color}`}>{cls.grade}</div>
                    <div className="t-info">
                      <strong>{cls.grade} — Ensino Fundamental</strong>
                      <p>{cls.school}</p>
                      <span className="t-meta">{cls.period} • {cls.students} Alunos</span>
                    </div>
                    <button className="btn-sm" onClick={() => showToast(`Acessando chamada do ${cls.grade}`)}>
                      Chamada
                    </button>
                  </article>
                ))}
              </div>
            </div>

            <div className="teacher-stats-bar">
              <div className="t-stat"><strong>81</strong><span>Total de Alunos</span></div>
              <div className="t-stat"><strong>3</strong><span>Turmas</span></div>
              <div className="t-stat ok"><strong>89%</strong><span>Frequência Média</span></div>
              <div className="t-stat"><strong>48</strong><span>Aulas dadas/mês</span></div>
            </div>

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button className="btn secondary" onClick={() => showToast('Modo de edição ativado')} type="button">
                Editar Dados
              </button>
              <button className="btn danger" onClick={() => setShowTeacherModal(false)} type="button">
                Fechar
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="modal-backdrop open" onClick={() => setSelectedStudent(null)}>
          <section className="modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="modal-title">
              <h2>Detalhes do Aluno</h2>
              <button className="icon-btn" onClick={() => setSelectedStudent(null)} type="button">
                <X size={18} />
              </button>
            </header>
            <div className="student-profile">
              <span className="avatar lg">{selectedStudent.name.slice(0, 2).toUpperCase()}</span>
              <div>
                <h3>{selectedStudent.name}</h3>
                <p>Data de nascimento: 12/03/2012</p>
                <p><strong>6º Ano A</strong> • Ensino Fundamental</p>
              </div>
            </div>
            <article className="mini-card">
              <h3>Responsável</h3>
              <p>{selectedStudent.parent || 'Maria de Fátima Souza (Mãe)'}</p>
              <span className="phone-row">
                <Phone size={14} /> {selectedStudent.phone || '(41) 98765-4321'} <MessageCircle size={14} color="#009b62" />
              </span>
            </article>
            <article className="mini-card month-card">
              <h3>Frequência no mês</h3>
              <div className="donut"><strong>{selectedStudent.rate || '86%'}</strong><small>Presença</small></div>
              <ul className="legend-list">
                <li><i className="legend green" />Presentes <strong>22</strong></li>
                <li><i className="legend red" />Faltas <strong>2</strong></li>
                <li><i className="legend orange" />Atrasos <strong>1</strong></li>
                <li><i className="legend purple" />Justificadas <strong>0</strong></li>
              </ul>
            </article>
          </section>
        </div>
      )}

      <div className="dashboard-shell">
        {/* Card 1: Login */}
        <section className="login-card panel" aria-label="Portal do professor">
          <div className="brand-mark">
            <BookOpenCheck size={46} />
            <div>
              <strong>Arau Escola</strong>
              <span>Gestão escolar e chamada</span>
            </div>
          </div>
          <div className="login-copy">
            <h1>Portal do Professor</h1>
            <p>Faça login para acessar o sistema</p>
          </div>
          <form className="login-form">
            <label>
              <UserRound size={16} />
              <input defaultValue="lucas.silva@araucaria.pr.gov.br" placeholder="CPF ou e-mail" />
            </label>
            <label>
              <ShieldCheck size={16} />
              <input defaultValue="••••••••" placeholder="Senha" type="password" />
              <Eye size={16} />
            </label>
            <div className="form-row">
              <span><i /> Lembrar-me</span>
              <button type="button" onClick={() => showToast('Link de recuperação enviado')}>Esqueci minha senha</button>
            </div>
            <button type="button" onClick={() => showToast('Login autenticado com sucesso')}>Entrar</button>
          </form>
          <div className="divider"><span>ou entrar com</span></div>
          <button className="google-button" type="button" onClick={() => showToast('Login via Google')}>G Login com Google</button>
        </section>

        {/* Card 2: Teacher Dashboard & Minhas Turmas */}
        <div className="teacher-dashboard panel">
          <aside className="sidebar">
            <div className="sidebar-brand">
              <BookOpenCheck size={28} />
              <span>Arau Escola<small>Gestão escolar</small></span>
            </div>
            <nav>
              {menuItems.map(([Icon, label], index) => (
                <button
                  className={index === 1 ? 'active' : ''}
                  key={label as string}
                  type="button"
                  onClick={() => showToast(`Navegando para ${label}`)}
                >
                  <Icon size={17} />
                  <span>{label as string}</span>
                </button>
              ))}
            </nav>
            <button className="exit" type="button" onClick={() => showToast('Saindo do sistema')}><LogOut size={17} /> Sair</button>
          </aside>

          <section className="classes panel">
            <header className="section-header">
              <div>
                <h2>Minhas Turmas</h2>
              </div>
              <button
                className="teacher teacher-clickable"
                onClick={() => setShowTeacherModal(true)}
                type="button"
                title="Clique para ver o perfil completo do professor"
              >
                <Bell size={20} />
                <span className="avatar teacher-avatar">LS</span>
                <span>Prof. Lucas Silva<small>Matemática • Ver Perfil</small></span>
              </button>
            </header>

            <div className="class-stack">
              {classes.map((item) => (
                <article className="class-card" key={item.grade}>
                  <strong className={`grade-badge ${item.color}`}>{item.grade}</strong>
                  <div>
                    <h3>{item.grade.replace('º', 'º Ano ')}</h3>
                    <p>{item.school}</p>
                    <div className="meta">
                      <span><UsersRound size={15} /> {item.students} alunos</span>
                      <span><Clock3 size={15} /> {item.period}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => showToast(`Iniciando chamada da turma ${item.grade}`)}>
                    Fazer chamada <ChevronRight size={18} />
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Card 3: Class Summary with Options Dropdown */}
        <section className="summary panel">
          <header className="topbar-centered" style={{ position: 'relative' }}>
            <span className="back-btn cursor-pointer" onClick={() => showToast('Voltando')}><ChevronLeft size={18} /> Voltar</span>
            <h2 className="header-center-title">Turma 6º Ano A</h2>
            <div className="header-right-action options-dropdown-wrap">
              <button
                className="icon-btn"
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                type="button"
                title="Opções da turma"
              >
                <MoreVertical size={19} />
              </button>
              {showClassDropdown && (
                <div className="class-dropdown open" style={{ position: 'absolute', top: 36, right: 0, zIndex: 30 }}>
                  <button type="button" onClick={() => { setShowClassDropdown(false); showToast('Editar turma'); }}>
                    <FileText size={14} /> Editar dados
                  </button>
                  <button type="button" onClick={() => { setShowClassDropdown(false); showToast('Abrindo histórico'); }}>
                    <Clock3 size={14} /> Histórico completo
                  </button>
                  <button type="button" onClick={() => { setShowClassDropdown(false); showToast('Relatório exportado'); }}>
                    <PieChart size={14} /> Exportar chamada
                  </button>
                </div>
              )}
            </div>
          </header>

          <article className="hero-class">
            <strong className="grade-badge teal">6º A</strong>
            <div>
              <h3>6º Ano A</h3>
              <p>Escola Municipal Professora Helena Kolody</p>
              <div className="meta">
                <span><UsersRound size={15} /> 28 alunos</span>
                <span><GraduationCap size={15} /> Ensino Fundamental</span>
                <span><Clock3 size={15} /> Manhã</span>
              </div>
            </div>
          </article>

          <article className="frequency-card">
            <div className="card-title">
              <h3>Resumo de frequência - Hoje</h3>
              <time>24/05/2024</time>
            </div>
            <div className="stats-grid">
              <span className="ok"><Check size={18} /> <strong>22</strong><small>Presentes</small></span>
              <span className="bad"><X size={18} /> <strong>3</strong><small>Faltas</small></span>
              <span className="warn"><Clock3 size={18} /> <strong>2</strong><small>Atrasos</small></span>
              <span className="info"><CalendarDays size={18} /> <strong>1</strong><small>Justificadas</small></span>
            </div>
          </article>

          <article className="info-card">
            <h3>Informações da turma</h3>
            <dl>
              <dt>Professor(a)</dt><dd>Lucas Silva</dd>
              <dt>Sala</dt><dd>12 (Bloco B)</dd>
              <dt>Componente</dt><dd>Matemática</dd>
              <dt>Horário</dt><dd>07:30 - 11:30</dd>
            </dl>
          </article>

          <button className="start-button" type="button" onClick={() => showToast('Chamada iniciada')}>
            <Play size={20} fill="currentColor" /> Iniciar chamada
          </button>
        </section>

        {/* Card 4: Attendance with Legend and Clickable Rows */}
        <section className="attendance panel">
          <header className="table-head">
            <span className="cursor-pointer" onClick={() => showToast('Voltando')}><ChevronLeft size={18} /> Voltar</span>
            <div>
              <h2>Chamada — 6º Ano A</h2>
              <time>24/05/2024</time>
            </div>
            <button type="button" onClick={() => showToast('Todos marcados como presentes')}>
              <Check size={16} /> Marcar todos como presentes
            </button>
          </header>

          {/* Legend */}
          <div className="legend-bar" style={{ marginTop: 12 }}>
            <strong className="legend-title">Legenda:</strong>
            <span className="legend-item-chip"><span className="dot present">P</span> Presente</span>
            <span className="legend-item-chip"><span className="dot absent">F</span> Falta</span>
            <span className="legend-item-chip"><span className="dot late">A</span> Atraso</span>
            <span className="legend-item-chip"><span className="dot excused">J</span> Justificada</span>
          </div>

          <div className="attendance-table" style={{ overflowX: 'auto' }}>
            <div className="row heading">
              <span>#</span><span>Aluno</span><span>Presente</span><span>Falta</span>
              <span>Atraso</span><span>Justificada</span><span>Ação</span><span />
            </div>
            {studentsList.map((st, index) => (
              <div
                className="row cursor-pointer"
                key={st.name}
                onClick={() => setSelectedStudent(st)}
                title="Clique para ver detalhes do aluno"
              >
                <span>{index + 1}</span>
                <span className="student"><span className="avatar mini-avatar">{st.name.slice(0, 2)}</span> {st.name}</span>
                <span><Mark active={st.status === 'present'} tone="present" /></span>
                <span><Mark active={st.status === 'absent'} tone="absent" /></span>
                <span><Mark active={st.status === 'late'} tone="late" /></span>
                <span><Mark active={st.status === 'excused'} tone="excused" /></span>
                <span><button className="btn-sm" type="button" onClick={(e) => { e.stopPropagation(); setSelectedStudent(st); }}>Ver</button></span>
                <span><MoreVertical size={16} /></span>
              </div>
            ))}
          </div>

          <div className="action-row">
            <button className="save" type="button" onClick={() => showToast('Chamada salva com sucesso')}>
              <FileText size={18} /> Salvar chamada
            </button>
            <button className="cancel" type="button" onClick={() => showToast('Cancelado')}>Cancelar</button>
          </div>
        </section>

        {/* Card 5: History Panel */}
        <section className="history panel">
          <header className="table-head">
            <span className="cursor-pointer"><ChevronLeft size={18} /></span>
            <h2>Histórico de Chamadas</h2>
            <Search size={19} />
          </header>
          <div className="history-table" style={{ overflowX: 'auto' }}>
            <div className="history-row heading">
              <span>Data</span><span>Presentes</span><span>Faltas</span><span>Atrasos</span><span>Justificadas</span><span>Ações</span>
            </div>
            {history.map(([date, present, absent, late, excused]) => (
              <div className="history-row" key={date as string}>
                <strong>{date}</strong><span>{present}</span><span>{absent}</span><span>{late}</span><span>{excused}</span>
                <Eye size={16} className="cursor-pointer" onClick={() => showToast(`Detalhes de ${date}`)} />
              </div>
            ))}
          </div>
          <button className="more-button" type="button" onClick={() => showToast('Histórico completo carregado')}>
            Ver mais chamadas
          </button>
        </section>

        {/* Card 6: WhatsApp Panel */}
        <section className="whatsapp panel">
          <div className="whatsapp-icon"><MessageCircle size={58} /></div>
          <h2>Notificação WhatsApp</h2>
          <p>Após salvar a chamada, o sistema pode notificar o responsável do aluno faltante.</p>
          <article className="message-bubble">
            <p>Olá, Maria de Fátima!</p>
            <p>A frequência de Bruno Henrique em 24/05:</p>
            <strong>Falta Registrada</strong>
            <p>Escola Municipal Professora Helena Kolody</p>
            <small>11:30 ✓✓</small>
          </article>
          <button type="button" onClick={() => showToast('Notificação enviada ao WhatsApp do responsável!')}>
            <MessageCircle size={18} /> Enviar via WhatsApp
          </button>
        </section>
      </div>

      <footer className="municipal-footer">
        <div>
          <ShieldCheck size={42} />
          <strong>ARAUCÁRIA</strong>
          <span>Secretaria Municipal de Educação</span>
        </div>
        <p>Educação que transforma.</p>
      </footer>
    </main>
  );
}
