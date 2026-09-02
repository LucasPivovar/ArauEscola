'use client';

import { useState } from 'react';
import type { ClassRoom, Role, Student, Teacher } from '../types';

type ClassDetailsModalProps = {
  classRoom: ClassRoom | null;
  isOpen: boolean;
  role: Role;
  allClasses: ClassRoom[];
  students: Student[];
  teachers: Teacher[];
  onClose: () => void;
  onAttendance: (classId: string) => void;
  onOpenStudent: (student: Student) => void;
  onViewObservationHistory: (student: Student) => void;
  onOpenImport?: (classRoom: ClassRoom) => void;
  onAddStudent: (classId: string, studentData: { matricula: string; name: string; responsible: string; phone: string }) => void;
  onChangeTeacher?: (classId: string, teacherName: string) => void;
  onToast: (msg: string) => void;
};

export function ClassDetailsModal({
  classRoom,
  isOpen,
  role,
  students,
  onClose,
  onAttendance,
  onOpenStudent,
  onViewObservationHistory,
  onOpenImport,
  onAddStudent,
  onToast,
}: ClassDetailsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentMat, setNewStudentMat] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentResp, setNewStudentResp] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  if (!isOpen || !classRoom) return null;

  const classStudents = students.filter((s) => s.classId === classRoom.id);
  const filteredStudents = classStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.matricula?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.responsible?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE) || 1;
  const paginatedStudents = filteredStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Average attendance rate
  const avgRate = classStudents.length
    ? Math.round(classStudents.reduce((acc, curr) => acc + curr.rate, 0) / classStudents.length)
    : 92;

  function handleCreateStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!newStudentName.trim() || !classRoom) return;

    onAddStudent(classRoom.id, {
      matricula: newStudentMat.trim() || `2024-${Math.floor(10000 + Math.random() * 90000)}`,
      name: newStudentName.trim(),
      responsible: newStudentResp.trim() || 'Responsável Legal',
      phone: newStudentPhone.trim() || '(41) 90000-0000',
    });

    setNewStudentMat('');
    setNewStudentName('');
    setNewStudentResp('');
    setNewStudentPhone('');
    setIsAddingStudent(false);
    onToast(`Aluno ${newStudentName} matriculado no ${classRoom.grade}!`);
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card class-details-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="class-modal-header-info">
            <span className={`grade-tile ${classRoom.accent}`}>{classRoom.grade.replace(' Ano', '')}</span>
            <div>
              <div className="modal-badge">
                <i className="bi bi-grid-1x2-fill" /> Gestão da Turma
              </div>
              <h2>{classRoom.grade} - {classRoom.period}</h2>
              <p>{classRoom.school} · {classRoom.time}</p>
            </div>
          </div>
          <button className="modal-close-btn" type="button" aria-label="Fechar modal" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <div className="modal-body">
          {/* Quick Info & Teacher Row */}
          <div className="class-management-info-bar">
            <div className="info-bar-item">
              <span className="info-bar-label">Professor Responsável</span>
              <div className="teacher-select-wrapper">
                <i className="bi bi-person-badge text-blue" />
                <strong>{classRoom.teacher || 'Prof. Lucas Silva'}</strong>
              </div>
            </div>

            <div className="info-bar-item">
              <span className="info-bar-label">Frequência Média</span>
              <strong className="text-green">{avgRate}%</strong>
            </div>

            <div className="info-bar-item">
              <span className="info-bar-label">Total de Alunos</span>
              <strong>{classStudents.length} matriculados</strong>
            </div>

            <div className="info-bar-action">
              <button
                className="primary-action compact"
                type="button"
                onClick={() => {
                  onClose();
                  onAttendance(classRoom.id);
                }}
              >
                <i className="bi bi-clipboard-check" />
                Fazer Chamada
              </button>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="class-students-toolbar">
            <div className="search-input-wrap">
              <i className="bi bi-search" />
              <input
                type="text"
                placeholder="Buscar aluno por nome, matrícula ou responsável..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="class-toolbar-actions">
              {role.mode === 'admin' && (
                <button
                  className="secondary-action compact"
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenImport?.(classRoom);
                  }}
                  title="Importar lista de alunos via CSV ou Planilha"
                >
                  <i className="bi bi-file-earmark-spreadsheet" /> Importar Alunos
                </button>
              )}

              <button
                className="secondary-action compact"
                type="button"
                onClick={() => setIsAddingStudent((prev) => !prev)}
              >
                <i className={`bi ${isAddingStudent ? 'bi-x-lg' : 'bi-person-plus-fill'}`} />
                {isAddingStudent ? 'Cancelar' : '+ Adicionar Aluno'}
              </button>
            </div>
          </div>

          {/* Add Student Inline Form */}
          {isAddingStudent && (
            <form className="add-student-inline-card" onSubmit={handleCreateStudent}>
              <div className="inline-card-header">
                <strong>Matricular novo aluno no {classRoom.grade}</strong>
                <small>Preencha os dados cadastrais para vincular imediatamente.</small>
              </div>

              <div className="form-group-grid">
                <label>
                  Número de Matrícula
                  <input
                    type="text"
                    required
                    placeholder="Ex: 2024-00155"
                    value={newStudentMat}
                    onChange={(e) => setNewStudentMat(e.target.value)}
                  />
                </label>
                <label>
                  Nome Completo do Aluno
                  <input
                    type="text"
                    required
                    placeholder="Nome completo..."
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-group-grid">
                <label>
                  Nome do Responsável
                  <input
                    type="text"
                    required
                    placeholder="Nome do responsável..."
                    value={newStudentResp}
                    onChange={(e) => setNewStudentResp(e.target.value)}
                  />
                </label>
                <label>
                  Telefone / WhatsApp
                  <input
                    type="text"
                    placeholder="(41) 90000-0000"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                  />
                </label>
              </div>

              <div className="inline-card-actions">
                <button type="submit" className="primary-action compact">
                  <i className="bi bi-check-lg" /> Salvar Matrícula
                </button>
              </div>
            </form>
          )}

          {/* Students List Table */}
          <div className="class-students-table-wrapper">
            <div className="table-row table-head-row">
              <span>#</span>
              <span>Aluno & Matrícula</span>
              <span>Responsável</span>
              <span>Frequência</span>
              <span>Ações / Manejo</span>
            </div>

            {paginatedStudents.length === 0 ? (
              <div className="no-students-message">
                <i className="bi bi-people" />
                <p>Nenhum aluno encontrado para esta turma.</p>
              </div>
            ) : (
              paginatedStudents.map((student, index) => (
                <div className="table-row" key={student.id}>
                  <span className="student-index">{(page - 1) * PAGE_SIZE + index + 1}</span>

                  <span className="student-cell">
                    <span className="student-avatar-mini">{student.name.slice(0, 2)}</span>
                    <div>
                      <div className="student-cell-name">{student.name}</div>
                      <span className="student-mat-badge">Mat: {student.matricula}</span>
                    </div>
                  </span>

                  <span className="student-responsible-cell">
                    <div>{student.responsible}</div>
                    <small className="text-muted">{student.phone}</small>
                  </span>

                  <span className="student-rate-cell">
                    <strong className={student.rate >= 90 ? 'text-green' : student.rate >= 80 ? 'text-orange' : 'text-red'}>
                      {student.rate}%
                    </strong>
                  </span>

                  <span className="student-row-actions-cell">
                    <button
                      type="button"
                      className="obs-eye-btn"
                      title={`Ver histórico de ocorrências de ${student.name}`}
                      onClick={() => {
                        onClose();
                        onViewObservationHistory(student);
                      }}
                    >
                      <i className="bi bi-eye" />
                      {student.observations && student.observations.length > 0 && (
                        <span className="obs-count-dot">{student.observations.length}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      className="secondary-action compact btn-transfer"
                      title="Manejar / Transferir aluno de turma ou editar ficha"
                      onClick={() => {
                        onClose();
                        onOpenStudent(student);
                      }}
                    >
                      <i className="bi bi-arrow-left-right" /> Manejar / Editar
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination-bar">
              <span>Mostrando {paginatedStudents.length} de {filteredStudents.length} alunos (Página {page} de {totalPages})</span>
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
        </div>

        <footer className="modal-footer">
          <button className="secondary-action" type="button" onClick={onClose}>
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );
}
