'use client';

import type { Student, StudentStatus } from '../types';

type ObservationHistoryModalProps = {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
};

const statusLabels: Record<StudentStatus, { label: string; className: string }> = {
  present: { label: 'Presente', className: 'present' },
  absent: { label: 'Falta', className: 'absent' },
  late: { label: 'Atraso', className: 'late' },
  excused: { label: 'Justificada', className: 'excused' },
  open: { label: 'Pendente', className: 'open' },
};

export function ObservationHistoryModal({
  student,
  isOpen,
  onClose,
}: ObservationHistoryModalProps) {
  if (!isOpen || !student) return null;

  const observations = student.observations || [];

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card obs-history-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="obs-modal-title-group">
            <span className="student-avatar-mini">{student.name.slice(0, 2)}</span>
            <div>
              <div className="modal-badge">
                <i className="bi bi-eye-fill" /> Histórico de Ocorrências e Observações
              </div>
              <h2>{student.name}</h2>
              <p>Matrícula: {student.matricula || 'N/D'} · Responsável: {student.responsible}</p>
            </div>
          </div>
          <button className="modal-close-btn" type="button" aria-label="Fechar modal" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <div className="modal-body">
          {observations.length === 0 ? (
            <div className="no-obs-state">
              <i className="bi bi-check-circle" />
              <h3>Nenhuma ocorrência registrada</h3>
              <p>Este aluno não possui anotações disciplinares ou observações pedagógicas registradas.</p>
            </div>
          ) : (
            <div className="obs-timeline-list">
              {observations.map((obs) => (
                <article className="obs-timeline-card" key={obs.id || `${obs.date}-${obs.time}`}>
                  <div className="obs-card-header">
                    <div className="obs-header-left">
                      <span className="obs-datetime-badge">
                        <i className="bi bi-calendar3" /> {obs.date} às {obs.time}
                      </span>
                      <span className="obs-teacher-tag">
                        <i className="bi bi-person-badge" /> {obs.teacher} ({obs.subject})
                      </span>
                    </div>

                    <div className="obs-header-right">
                      <span className="obs-status-label">Chamada:</span>
                      <span className={`status-badge ${statusLabels[obs.status]?.className || 'present'}`}>
                        {statusLabels[obs.status]?.label || 'Presente'}
                      </span>
                    </div>
                  </div>

                  <div className="obs-card-body">
                    <i className="bi bi-chat-left-quote-fill text-muted" />
                    <p className="obs-description-text">{obs.description}</p>
                  </div>
                </article>
              ))}
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
