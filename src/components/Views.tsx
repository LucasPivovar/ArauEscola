'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ClassRoom, HistoryRecord, Role, Student, StudentStatus, ViewId } from '../types';

const statusInfo: Record<StudentStatus, { label: string; short: string; className: string }> = {
  present: { label: 'Presente', short: 'P', className: 'present' },
  absent: { label: 'Falta', short: 'F', className: 'absent' },
  late: { label: 'Atraso', short: 'A', className: 'late' },
  excused: { label: 'Justificada', short: 'J', className: 'excused' },
  open: { label: 'Em aberto', short: '-', className: 'open' },
};

type HeaderProps = {
  title: string;
  subtitle: string;
  action?: ReactNode;
};

function PageHeader({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action && <div className="page-action">{action}</div>}
    </header>
  );
}

function KpiCard({ icon, label, value, tone }: { icon: string; label: string; value: string; tone: string }) {
  return (
    <article className="kpi-card">
      <div className={`kpi-icon-wrap ${tone}`}>
        <i className={`bi ${icon}`} />
      </div>
      <div className="kpi-text">
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

function Badge({ status }: { status: StudentStatus }) {
  const item = statusInfo[status];
  return <span className={`status-badge ${item.className}`}>{item.label}</span>;
}

export function DashboardView({
  classes,
  role,
  selectedClass,
  onClassSelect,
  onNavigate,
  onOpenManagement,
}: {
  classes: ClassRoom[];
  role: Role;
  selectedClass: ClassRoom;
  onClassSelect: (classId: string) => void;
  onNavigate: (view: ViewId) => void;
  onOpenManagement?: (tab: 'professores' | 'secretaria' | 'operadores') => void;
}) {
  const isAdmin = role.mode === 'admin';

  return (
    <section className="page-stack">
      <PageHeader
        title="Início"
        subtitle={`Bem-vindo(a), ${role.name}. ${role.scope}`}
      />

      <article className="role-panel">
        <div>
          <span className="date-chip">
            <i className="bi bi-calendar3" />
            Sexta-feira, 24 de Maio de 2024
          </span>
          <h2>{isAdmin ? `Painel ClassConecta - ${role.label}` : 'Painel pedagógico'}</h2>
          <p>{role.description}</p>
        </div>
        <div className="role-panel-actions">
          <button type="button" onClick={() => onClassSelect(selectedClass.id)}>
            <i className="bi bi-clipboard-check" />
            Fazer chamada
          </button>
          <button type="button" onClick={() => onNavigate('turmas')}>
            <i className="bi bi-grid-1x2" />
            Turmas
          </button>
        </div>
      </article>

      <div className="kpi-grid">
        <KpiCard icon="bi-person-check-fill" label="Presença média" value="89%" tone="green" />
        <KpiCard icon="bi-grid-fill" label={isAdmin ? 'Turmas ativas' : 'Minhas turmas'} value={String(classes.length)} tone="blue" />
        <KpiCard icon="bi-people-fill" label="Alunos acompanhados" value="81" tone="violet" />
        <KpiCard icon="bi-exclamation-circle-fill" label="Chamadas pendentes" value="1" tone="orange" />
      </div>

      <div className={isAdmin ? 'dashboard-grid admin' : 'dashboard-grid'}>
        <article className="panel-card">
          <div className="section-title">
            <div>
              <h2>{isAdmin ? 'Acompanhamento de Hoje' : 'Minhas Aulas de Hoje'}</h2>
              <p>{isAdmin ? 'Acompanhe as chamadas realizadas e pendentes.' : 'Fluxo direto: selecione a turma para iniciar a chamada.'}</p>
            </div>
            <button className="text-link" type="button" onClick={() => onNavigate('turmas')}>
              Ver turmas <i className="bi bi-chevron-right" />
            </button>
          </div>

          <div className="class-list">
            {classes.map((item) => (
              <article className="dashboard-class-card" key={item.id}>
                <div className="dashboard-class-info-row">
                  <span className={`grade-tile ${item.accent}`}>{item.grade.replace(' Ano', '')}</span>
                  <div className="dashboard-class-details">
                    <strong>
                      {item.grade} - {item.period}
                    </strong>
                    <p>
                      {item.time} · {item.students} alunos · {item.teacher || 'Prof. Lucas Silva'}
                    </p>
                  </div>
                </div>
                <button
                  className="primary-action full-width"
                  type="button"
                  onClick={() => onClassSelect(item.id)}
                >
                  <i className="bi bi-clipboard-check" />
                  Fazer chamada
                </button>
              </article>
            ))}
          </div>
        </article>

        {isAdmin && (
          <article className="panel-card">
            <div className="section-title">
              <div>
                <h2>Desempenho por Turma</h2>
                <p>Média geral de presença apurada por sala.</p>
              </div>
              <button className="text-link" type="button" onClick={() => onNavigate('consulta')}>
                Relatórios <i className="bi bi-chevron-right" />
              </button>
            </div>
            <div className="class-performance-list">
              {classes.map((cls) => {
                const rate = cls.id === '6a' ? 94 : cls.id === '7b' ? 82 : 95;
                return (
                  <div className="class-perf-item" key={cls.id}>
                    <div className="class-perf-info">
                      <span className={`grade-tile ${cls.accent}`}>{cls.grade.replace(' Ano', '')}</span>
                      <div>
                        <strong>{cls.grade} - {cls.period}</strong>
                        <small>{cls.teacher || 'Prof. Lucas Silva'} · {cls.students} alunos</small>
                      </div>
                    </div>
                    <div className="class-perf-bar-wrap">
                      <div className="class-perf-bar">
                        <div className={`class-perf-fill ${rate >= 90 ? 'green' : 'orange'}`} style={{ width: `${rate}%` }} />
                      </div>
                      <strong className={`perf-rate ${rate >= 90 ? 'text-green' : 'text-orange'}`}>{rate}%</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        )}

        {isAdmin && (
          <article className="panel-card">
            <div className="section-title">
              <div>
                <h2>Atenção de Ausências</h2>
                <p>Alunos com maior índice de ausência no período.</p>
              </div>
              <button className="text-link" type="button" onClick={() => onNavigate('consulta')}>
                Consultar todos <i className="bi bi-chevron-right" />
              </button>
            </div>
            <div className="absence-attention-list">
              <div className="absence-student-row">
                <span className="student-avatar-mini">La</span>
                <div className="absence-student-info">
                  <strong>Laura Beatriz Oliveira</strong>
                  <small>7º Ano B · 4 faltas no período</small>
                </div>
                <span className="rate-chip low">82% presença</span>
              </div>
              <div className="absence-student-row">
                <span className="student-avatar-mini">Br</span>
                <div className="absence-student-info">
                  <strong>Bruno Henrique Souza</strong>
                  <small>6º Ano A · 3 faltas no período</small>
                </div>
                <span className="rate-chip low">86% presença</span>
              </div>
              <div className="absence-student-row">
                <span className="student-avatar-mini">Ca</span>
                <div className="absence-student-info">
                  <strong>Carlos Eduardo Martins</strong>
                  <small>6º Ano A · 2 faltas · 3 atrasos</small>
                </div>
                <span className="rate-chip mid">88% presença</span>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

export function ClassesView({
  classes,
  role,
  onAttendance,
  onNewClass,
  onManageClass,
}: {
  classes: ClassRoom[];
  role: Role;
  onAttendance: (classId: string) => void;
  onNewClass?: () => void;
  onManageClass?: (classRoom: ClassRoom) => void;
}) {
  return (
    <section className="page-stack">
      <PageHeader
        title={role.mode === 'admin' ? 'Turmas' : 'Minhas turmas'}
        subtitle={role.mode === 'admin' ? 'Organização das turmas e vínculos da escola.' : 'Turmas liberadas para sua rotina de chamada.'}
        action={
          role.mode === 'admin' && onNewClass ? (
            <button className="primary-action" type="button" onClick={onNewClass}>
              <i className="bi bi-plus-lg" />
              Nova turma
            </button>
          ) : undefined
        }
      />
      <div className="class-card-grid">
        {classes.map((item) => (
          <article className="class-card" key={item.id}>
            <div className="class-card-header-row">
              <span className={`grade-tile ${item.accent}`}>{item.grade.replace(' Ano', '')}</span>
              <button
                type="button"
                className="class-menu-btn"
                title="Gestão da turma, alunos e professor"
                onClick={() => onManageClass?.(item)}
              >
                <i className="bi bi-three-dots-vertical" />
              </button>
            </div>
            <div>
              <h2>{item.grade}</h2>
              <p>{item.school}</p>
              <dl>
                <div>
                  <dt>Período</dt>
                  <dd>
                    {item.period} · {item.time}
                  </dd>
                </div>
                <div>
                  <dt>Alunos</dt>
                  <dd>{item.students}</dd>
                </div>
              </dl>
            </div>
            <button
              className="primary-action"
              type="button"
              onClick={() => onAttendance(item.id)}
            >
              <i className="bi bi-clipboard-check" />
              Chamada
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AttendanceView({
  classRoom,
  students,
  onSave,
  onCancel,
  onOpenObservation,
}: {
  classRoom: ClassRoom;
  students: Student[];
  onSave: () => void;
  onCancel?: () => void;
  onOpenObservation?: (student: Student, currentStatus: StudentStatus) => void;
}) {
  const [statusByStudent, setStatusByStudent] = useState<Record<number, StudentStatus>>(
    Object.fromEntries(students.map((student) => [student.id, student.status])) as Record<number, StudentStatus>,
  );
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(students.length / PAGE_SIZE) || 1;
  const paginatedStudents = students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function setStatus(studentId: number, status: StudentStatus) {
    setStatusByStudent((current) => ({ ...current, [studentId]: status }));
  }

  function markAllPresent() {
    setStatusByStudent(Object.fromEntries(students.map((student) => [student.id, 'present'])) as Record<number, StudentStatus>);
  }

  return (
    <section className="page-stack">
      <PageHeader
        title={`Chamada - ${classRoom.grade}`}
        subtitle={`${classRoom.period}, ${classRoom.time} · ${classRoom.school}`}
        action={
          <button className="secondary-action" type="button" onClick={markAllPresent}>
            <i className="bi bi-check2-all" />
            Marcar todos presentes
          </button>
        }
      />

      <div className="legend-panel">
        {(['present', 'absent', 'late', 'excused'] as StudentStatus[]).map((status) => (
          <span key={status}>
            <b className={`status-dot ${statusInfo[status].className}`}>{statusInfo[status].short}</b>
            {statusInfo[status].label}
          </span>
        ))}
      </div>

      <article className="table-card">
        <div className="attendance-table">
          <div className="table-row table-head-row">
            <span>#</span>
            <span>Aluno</span>
            <span>Presente</span>
            <span>Falta</span>
            <span>Atraso</span>
            <span>Justificada</span>
            <span>Obs.</span>
          </div>
          {paginatedStudents.map((student, index) => (
            <div className="table-row" key={student.id}>
              <span className="student-index">{(page - 1) * PAGE_SIZE + index + 1}</span>
              <span className="student-cell">
                <span className="student-avatar-mini">{student.name.slice(0, 2)}</span>
                <span className="student-cell-name">{student.name}</span>
              </span>
              {(['present', 'absent', 'late', 'excused'] as StudentStatus[]).map((status) => (
                <span key={status}>
                  <button
                    className={`radio-button ${statusInfo[status].className} ${statusByStudent[student.id] === status ? 'active' : ''}`}
                    type="button"
                    aria-label={`${statusInfo[status].label} para ${student.name}`}
                    onClick={() => setStatus(student.id, status)}
                  />
                </span>
              ))}
              <span>
                <button
                  type="button"
                  className={`obs-pencil-btn ${student.observations && student.observations.length > 0 ? 'has-obs' : ''}`}
                  title={`Anotar ocorrência de chamada para ${student.name}`}
                  onClick={() => onOpenObservation?.(student, statusByStudent[student.id] || 'present')}
                >
                  <i className="bi bi-pencil" />
                  {student.observations && student.observations.length > 0 && (
                    <span className="obs-count-dot">{student.observations.length}</span>
                  )}
                </button>
              </span>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination-bar">
            <span>Mostrando {paginatedStudents.length} de {students.length} alunos (Página {page} de {totalPages})</span>
            <div className="pagination-buttons">
              <button
                type="button"
                className="secondary-action compact"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <i className="bi bi-chevron-left" /> Anterior
              </button>
              <button
                type="button"
                className="secondary-action compact"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Próximo <i className="bi bi-chevron-right" />
              </button>
            </div>
          </div>
        )}
      </article>

      <div className="sticky-actions">
        <button className="primary-action" type="button" onClick={onSave}>
          <i className="bi bi-save" />
          Salvar chamada
        </button>
        {onCancel && (
          <button className="secondary-action" type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </section>
  );
}

export function ConsultationView({
  classes,
  historyRecords,
  role,
  search,
  selectedClassId,
  statusFilter,
  students,
  onClassChange,
  onExport,
  onSearch,
  onStatusFilter,
  onSelectStudent,
  onSelectHistoryRecord,
  onViewObservationHistory,
}: {
  classes: ClassRoom[];
  historyRecords: HistoryRecord[];
  role: Role;
  search: string;
  selectedClassId: string;
  statusFilter: StudentStatus | 'all';
  students: Student[];
  onClassChange: (classId: string) => void;
  onExport: () => void;
  onSearch: (value: string) => void;
  onStatusFilter: (status: StudentStatus | 'all') => void;
  onSelectStudent?: (student: Student) => void;
  onSelectHistoryRecord?: (record: HistoryRecord) => void;
  onViewObservationHistory?: (student: Student) => void;
}) {
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [studentPage, setStudentPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const PAGE_SIZE = 10;

  const hasSelection = Boolean(selectedClassId) || showAllStudents || showAllHistory;

  const visibleStudents = useMemo(
    () =>
      students.filter((student) => {
        const matchesClass = showAllStudents || (selectedClassId ? student.classId === selectedClassId : false);
        const sameStatus = statusFilter === 'all' || student.status === statusFilter;
        const sameSearch =
          student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.matricula?.toLowerCase().includes(search.toLowerCase()) ||
          student.responsible?.toLowerCase().includes(search.toLowerCase());
        return matchesClass && sameStatus && sameSearch;
      }),
    [search, selectedClassId, showAllStudents, statusFilter, students],
  );

  const displayHistory = useMemo(() => {
    if (showAllHistory) return historyRecords;
    if (!selectedClassId) return [];
    return historyRecords.filter((record) => record.classId === selectedClassId);
  }, [historyRecords, selectedClassId, showAllHistory]);

  const totalStudentPages = Math.ceil(visibleStudents.length / PAGE_SIZE) || 1;
  const paginatedVisibleStudents = visibleStudents.slice((studentPage - 1) * PAGE_SIZE, studentPage * PAGE_SIZE);

  const totalHistoryPages = Math.ceil(displayHistory.length / PAGE_SIZE) || 1;
  const paginatedHistory = displayHistory.slice((historyPage - 1) * PAGE_SIZE, historyPage * PAGE_SIZE);

  return (
    <section className="page-stack">
      <PageHeader
        title="Consulta"
        subtitle="Alunos, histórico de chamadas e relatórios unificados por turma."
        action={
          <button className="secondary-action" type="button" onClick={onExport}>
            <i className="bi bi-download" />
            Exportar CSV
          </button>
        }
      />

      <article className="filters-card">
        <div className="filter-grid">
          <label>
            <span>Turma</span>
            <select
              value={selectedClassId}
              disabled={showAllStudents}
              onChange={(event) => {
                onClassChange(event.target.value);
                setStudentPage(1);
                setHistoryPage(1);
              }}
            >
              <option value="">Selecione uma turma...</option>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.grade} - {item.period}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Aluno</span>
            <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar por nome ou matrícula" />
          </label>
          <label>
            <span>Período/data</span>
            <input type="date" defaultValue="2024-05-24" />
          </label>
          <label>
            <span>Visualização</span>
            <select defaultValue="geral">
              <option value="geral">Geral da turma</option>
              <option value="individual">Individual</option>
            </select>
          </label>
        </div>
        <div className="status-filter-row">
          {(['all', 'present', 'absent', 'late', 'excused'] as const).map((status) => (
            <button className={statusFilter === status ? 'active' : ''} key={status} type="button" onClick={() => onStatusFilter(status)}>
              {status === 'all' ? 'Todos' : statusInfo[status].label}
            </button>
          ))}
        </div>
      </article>

      {!hasSelection ? (
        <article className="empty-selection-card">
          <div className="empty-icon-wrap">
            <i className="bi bi-mortarboard-fill" />
          </div>
          <h2>Nenhuma turma selecionada</h2>
          <p>Selecione uma turma no filtro acima para carregar os indicadores de presença, gráfico semanal, histórico de chamadas e a lista de alunos.</p>
        </article>
      ) : (
        <>
          <div className="kpi-grid">
            <KpiCard icon="bi-person-check-fill" label="Presença média" value="89%" tone="green" />
            <KpiCard icon="bi-person-x-fill" label="Faltas no mês" value="11" tone="red" />
            <KpiCard icon="bi-clock-fill" label="Atrasos" value="6" tone="orange" />
            <KpiCard icon="bi-calendar2-check-fill" label="Justificativas" value="4" tone="violet" />
          </div>

          <div className="dashboard-grid">
            <article className="panel-card chart-panel">
              <div className="section-title">
                <div>
                  <h2>Frequência semanal</h2>
                  <p>Média percentual de presença dos últimos dias letivos.</p>
                </div>
              </div>
              <div className="bar-chart-container">
                <div className="bar-chart" aria-label="Frequência semanal">
                  {[
                    { day: 'Seg', val: 72 },
                    { day: 'Ter', val: 88 },
                    { day: 'Qua', val: 74 },
                    { day: 'Qui', val: 92 },
                    { day: 'Sex', val: 86 },
                  ].map((item) => (
                    <div className="bar-col" key={item.day}>
                      <div className="bar-track">
                        <span className="bar-fill" style={{ height: `${item.val}%` }}>
                          <span className="bar-val">{item.val}%</span>
                        </span>
                      </div>
                      <span className="bar-day">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="panel-card history-panel">
              <div className="section-title">
                <div>
                  <h2>{showAllHistory ? 'Todo o Histórico de Chamadas' : 'Histórico de chamadas'}</h2>
                  <p>{showAllHistory ? 'Registros de todas as turmas da escola.' : 'Clique em uma data para ver detalhes ou editar presenças.'}</p>
                </div>
                <button
                  className="text-link"
                  type="button"
                  onClick={() => setShowAllHistory((prev) => !prev)}
                >
                  {showAllHistory ? 'Ver apenas desta turma' : 'Ver todos'}
                </button>
              </div>
              <div className="history-list">
                {paginatedHistory.length === 0 ? (
                  <p className="no-records">Nenhum registro encontrado para esta turma.</p>
                ) : (
                  paginatedHistory.map((record) => {
                    const recordClass = classes.find((c) => c.id === record.classId);
                    return (
                      <div
                        className="history-row clickable"
                        key={record.id || `${record.classId}-${record.date}`}
                        onClick={() => onSelectHistoryRecord?.(record)}
                        title="Clique para ver os detalhes e editar este registro de chamada"
                      >
                        <div className="history-date">
                          <i className="bi bi-calendar3" />
                          <strong>{record.date}</strong>
                          {showAllHistory && recordClass && (
                            <span className="class-badge-mini">{recordClass.grade}</span>
                          )}
                          {record.isLocked && <i className="bi bi-lock text-muted" title="Histórico fechado" />}
                        </div>
                        <div className="history-tags">
                          <span className="mini-tag green">{record.present} presentes</span>
                          <span className="mini-tag red">{record.absent} faltas</span>
                          <span className="mini-tag orange">{record.late} atrasos</span>
                          <i className="bi bi-chevron-right text-muted" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {totalHistoryPages > 1 && (
                <div className="pagination-bar compact">
                  <span>Página {historyPage} de {totalHistoryPages}</span>
                  <div className="pagination-buttons">
                    <button
                      type="button"
                      className="secondary-action compact"
                      disabled={historyPage <= 1}
                      onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                    >
                      <i className="bi bi-chevron-left" />
                    </button>
                    <button
                      type="button"
                      className="secondary-action compact"
                      disabled={historyPage >= totalHistoryPages}
                      onClick={() => setHistoryPage((p) => Math.min(totalHistoryPages, p + 1))}
                    >
                      <i className="bi bi-chevron-right" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          </div>

          <article className="panel-card student-panel">
            <div className="student-list-head">
              <div>
                <h2>{showAllStudents ? 'Todos os Alunos da Escola' : 'Alunos da Turma'}</h2>
                <p>{showAllStudents ? 'Listagem geral de todas as turmas cadastradas.' : 'Lista de alunos vinculados com frequência, responsáveis e detalhes.'}</p>
              </div>
              <div className="student-head-actions">
                <button
                  className={`secondary-action compact ${showAllStudents ? 'active-toggle' : ''}`}
                  type="button"
                  onClick={() => setShowAllStudents((prev) => !prev)}
                >
                  <i className={`bi ${showAllStudents ? 'bi-funnel-fill' : 'bi-people-fill'}`} />
                  {showAllStudents ? 'Filtrar por turma atual' : 'Ver todos'}
                </button>
                <span className="results-chip">{visibleStudents.length} encontrados</span>
              </div>
            </div>
            <div className="student-list">
              {paginatedVisibleStudents.map((student) => {
                const studentClass = classes.find((c) => c.id === student.classId);
                return (
                  <div className="student-row" key={student.id}>
                    <div
                      className="student-info clickable"
                      onClick={() => onSelectStudent?.(student)}
                      title="Clique para ver a ficha completa do aluno"
                    >
                      <span className="student-avatar">{student.name.slice(0, 2)}</span>
                      <div className="student-details">
                        <div className="student-name-row">
                          <span className="student-name">{student.name}</span>
                          <span className="student-mat-badge">Mat: {student.matricula}</span>
                          {showAllStudents && studentClass && (
                            <span className="class-badge-mini">{studentClass.grade}</span>
                          )}
                        </div>
                        <span className="student-responsible">
                          <i className="bi bi-person" /> {student.responsible}
                          {student.phone && <span className="student-phone">· {student.phone}</span>}
                        </span>
                      </div>
                    </div>
                    <div className="student-stats">
                      <Badge status={student.status} />
                      <span className="student-rate">{student.rate}%</span>
                      <button
                        type="button"
                        className="obs-eye-btn"
                        title={`Ver histórico de ocorrências de ${student.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewObservationHistory?.(student);
                        }}
                      >
                        <i className="bi bi-eye" />
                        {student.observations && student.observations.length > 0 && (
                          <span className="obs-count-dot">{student.observations.length}</span>
                        )}
                      </button>
                      <button
                        type="button"
                        className="student-menu-btn"
                        title="Gerenciar Aluno (Transferir turma, ficha completa)"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent?.(student);
                        }}
                      >
                        <i className="bi bi-three-dots-vertical" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalStudentPages > 1 && (
              <div className="pagination-bar">
                <span>Mostrando {paginatedVisibleStudents.length} de {visibleStudents.length} alunos (Página {studentPage} de {totalStudentPages})</span>
                <div className="pagination-buttons">
                  <button
                    type="button"
                    className="secondary-action compact"
                    disabled={studentPage <= 1}
                    onClick={() => setStudentPage((p) => Math.max(1, p - 1))}
                  >
                    <i className="bi bi-chevron-left" /> Anterior
                  </button>
                  <button
                    type="button"
                    className="secondary-action compact"
                    disabled={studentPage >= totalStudentPages}
                    onClick={() => setStudentPage((p) => Math.min(totalStudentPages, p + 1))}
                  >
                    Próximo <i className="bi bi-chevron-right" />
                  </button>
                </div>
              </div>
            )}
          </article>
        </>
      )}
    </section>
  );
}

export function SettingsView({ role, onSave }: { role: Role; onSave: () => void }) {
  return (
    <section className="page-stack">
      <PageHeader
        title="Configurações"
        subtitle={`Preferências do perfil ${role.label}.`}
        action={
          <button className="primary-action" type="button" onClick={onSave}>
            <i className="bi bi-save" />
            Salvar preferências
          </button>
        }
      />

      <div className="settings-stack">
        <article className="setting-row">
          <span className="setting-icon">
            <i className="bi bi-bell-fill" />
          </span>
          <div>
            <h2>Lembrete de chamada pendente</h2>
            <p>Receber alerta no dispositivo quando houver chamada em aberto após o início da aula.</p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span />
          </label>
        </article>

        <article className="setting-row">
          <span className="setting-icon teal">
            <i className="bi bi-shield-check" />
          </span>
          <div>
            <h2>Modo privacidade pedagógica</h2>
            <p>Ocultar dados pessoais de contato em telas projetadas ou compartilhadas em sala.</p>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span />
          </label>
        </article>
      </div>
    </section>
  );
}
