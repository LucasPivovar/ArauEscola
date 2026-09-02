'use client';

import { useState } from 'react';
import type { ClassRoom, HistoryRecord, Role, Student, StudentStatus } from '../types';

const statusInfo: Record<StudentStatus, { label: string; className: string }> = {
  present: { label: 'Presente', className: 'present' },
  absent: { label: 'Falta', className: 'absent' },
  late: { label: 'Atraso', className: 'late' },
  excused: { label: 'Justificada', className: 'excused' },
  open: { label: 'Pendente', className: 'open' },
};

type HistoryModalProps = {
  record: HistoryRecord | null;
  isOpen: boolean;
  role: Role;
  classes: ClassRoom[];
  students: Student[];
  onClose: () => void;
  onSaveRecord: (updatedRecord: HistoryRecord) => void;
  onToast: (msg: string) => void;
};

export function HistoryModal({
  record,
  isOpen,
  role,
  classes,
  students,
  onClose,
  onSaveRecord,
  onToast,
}: HistoryModalProps) {
  const [editedRecords, setEditedRecords] = useState<Record<number, StudentStatus>>({});
  const [isUnlockedForRoutine, setIsUnlockedForRoutine] = useState(false);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  if (!isOpen || !record) return null;

  const currentClass = classes.find((c) => c.id === record.classId);
  const classStudents = students.filter((s) => s.classId === record.classId);
  const isAdmin = role.mode === 'admin';
  const canEdit = isAdmin || isUnlockedForRoutine || !record.isLocked;

  // Initialize records from record or default
  const activeRecords = {
    ...(record.studentRecords || {}),
    ...editedRecords,
  };

  function handleStatusChange(studentId: number, nextStatus: StudentStatus) {
    if (!canEdit) return;
    setEditedRecords((prev) => ({ ...prev, [studentId]: nextStatus }));
  }

  function handleRequestPermission() {
    setHasRequestedPermission(true);
    onToast('Solicitação de autorização para edição enviada à Direção/Secretaria.');
  }

  function handleToggleSimulationApproval() {
    setIsUnlockedForRoutine((prev) => !prev);
    onToast(isUnlockedForRoutine ? 'Edição bloqueada novamente.' : 'Permissão concedida pela Secretaria/Direção!');
  }

  function handleSave() {
    if (!record) return;

    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;

    classStudents.forEach((student) => {
      const status = activeRecords[student.id] || student.status;
      if (status === 'present') presentCount++;
      else if (status === 'absent') absentCount++;
      else if (status === 'late') lateCount++;
      else if (status === 'excused') excusedCount++;
    });

    const updated: HistoryRecord = {
      id: record.id || `hist-${Date.now()}`,
      date: record.date,
      classId: record.classId,
      isLocked: record.isLocked,
      present: presentCount || record.present,
      absent: absentCount || record.absent,
      late: lateCount || record.late,
      excused: excusedCount || record.excused,
      studentRecords: activeRecords,
    };

    onSaveRecord(updated);
    onToast(`Chamada do dia ${record.date} atualizada com sucesso!`);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card history-detail-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div>
            <div className="modal-badge">
              <i className="bi bi-calendar-check" /> Registro de Chamada Passada
            </div>
            <h2>Chamada de {record.date} - {currentClass ? currentClass.grade : record.classId}</h2>
            <p>
              {currentClass ? `${currentClass.period} · ${currentClass.school}` : ''} · {record.present} presentes, {record.absent} faltas
            </p>
          </div>
          <button className="modal-close-btn" type="button" aria-label="Fechar modal" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <div className="modal-body">
          {/* Permission Status Banner */}
          {!isAdmin && record.isLocked && !isUnlockedForRoutine && (
            <div className="permission-lock-banner">
              <div className="lock-icon">
                <i className="bi bi-lock-fill" />
              </div>
              <div className="lock-text">
                <strong>Edição de chamada passada bloqueada</strong>
                <p>Para alterar presenças de dias anteriores, é necessária a autorização da Secretaria ou Diretor.</p>
              </div>
              {!hasRequestedPermission ? (
                <button
                  className="primary-action compact"
                  type="button"
                  onClick={handleRequestPermission}
                >
                  <i className="bi bi-shield-check" /> Solicitar Permissão
                </button>
              ) : (
                <span className="status-pill blue">
                  <i className="bi bi-clock-history" /> Solicitação Pendente
                </span>
              )}
            </div>
          )}

          {/* Admin or unlocked notice */}
          {canEdit && (
            <div className="permission-unlock-banner">
              <i className="bi bi-unlock-fill text-green" />
              <span>Modo de edição liberado para este registro. Altere as presenças abaixo e salve.</span>
            </div>
          )}

          {/* Student attendance edit list */}
          <div className="history-attendance-table">
            <div className="table-row table-head-row">
              <span>#</span>
              <span>Aluno</span>
              <span>Presente</span>
              <span>Falta</span>
              <span>Atraso</span>
              <span>Justificada</span>
            </div>

            {classStudents.map((student, index) => {
              const currentStatus = activeRecords[student.id] || student.status;
              return (
                <div className="table-row" key={student.id}>
                  <span className="student-index">{index + 1}</span>
                  <span className="student-cell">
                    <span className="student-avatar-mini">{student.name.slice(0, 2)}</span>
                    <span className="student-cell-name">{student.name}</span>
                  </span>

                  {(['present', 'absent', 'late', 'excused'] as StudentStatus[]).map((st) => (
                    <span key={st}>
                      <button
                        className={`radio-button ${statusInfo[st].className} ${currentStatus === st ? 'active' : ''} ${!canEdit ? 'disabled' : ''}`}
                        type="button"
                        disabled={!canEdit}
                        title={canEdit ? `Marcar como ${statusInfo[st].label}` : 'Edição bloqueada'}
                        onClick={() => handleStatusChange(student.id, st)}
                      />
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <footer className="modal-footer">
          <button className="secondary-action" type="button" onClick={onClose}>
            Fechar
          </button>
          {canEdit && (
            <button className="primary-action" type="button" onClick={handleSave}>
              <i className="bi bi-save" />
              Salvar Alterações no Histórico
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
