'use client';

import { useState } from 'react';
import type { ClassRoom, Student, StudentObservation, StudentStatus } from '../types';

type ObservationModalProps = {
  student: Student | null;
  classRoom: ClassRoom | null;
  currentStatus?: StudentStatus;
  isOpen: boolean;
  onClose: () => void;
  onSaveObservation: (studentId: number, observation: StudentObservation) => void;
  onToast: (msg: string) => void;
};

const statusLabels: Record<StudentStatus, { label: string; className: string }> = {
  present: { label: 'Presente', className: 'present' },
  absent: { label: 'Falta', className: 'absent' },
  late: { label: 'Atraso', className: 'late' },
  excused: { label: 'Justificada', className: 'excused' },
  open: { label: 'Pendente', className: 'open' },
};

export function ObservationModal({
  student,
  classRoom,
  currentStatus = 'present',
  isOpen,
  onClose,
  onSaveObservation,
  onToast,
}: ObservationModalProps) {
  const [description, setDescription] = useState('');

  if (!isOpen || !student) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || !student) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = '24/05/2024';

    const newObs: StudentObservation = {
      id: `obs-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      teacher: classRoom?.teacher || 'Prof. Lucas Silva',
      subject: 'Matemática',
      status: currentStatus,
      description: description.trim(),
    };

    onSaveObservation(student.id, newObs);
    setDescription('');
    onToast(`Ocorrência registrada para ${student.name}!`);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card compact" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="obs-modal-title-group">
            <span className="student-avatar-mini">{student.name.slice(0, 2)}</span>
            <div>
              <div className="modal-badge">
                <i className="bi bi-pencil-square" /> Anotar Ocorrência de Chamada
              </div>
              <h2>{student.name}</h2>
              <p>Matrícula: {student.matricula || 'N/D'} · {classRoom ? classRoom.grade : ''}</p>
            </div>
          </div>
          <button className="modal-close-btn" type="button" aria-label="Fechar modal" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Live Context Banner */}
            <div className="obs-live-context-card">
              <div className="context-item">
                <span className="context-label">Status nesta chamada:</span>
                <span className={`status-badge ${statusLabels[currentStatus]?.className || 'present'}`}>
                  {statusLabels[currentStatus]?.label || 'Presente'}
                </span>
              </div>
              <div className="context-item">
                <span className="context-label">Professor / Matéria:</span>
                <strong>{classRoom?.teacher || 'Prof. Lucas Silva'} · Matemática</strong>
              </div>
            </div>

            <label className="obs-textarea-label">
              <span>Descrição da Ocorrência</span>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o que ocorreu (ex: Aluno matou a 2ª aula / Não presta atenção e atrapalha a turma / Saiu da sala sem autorização)..."
                required
                autoFocus
              />
            </label>
          </div>

          <footer className="modal-footer">
            <button className="secondary-action" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="primary-action" type="submit" disabled={!description.trim()}>
              <i className="bi bi-check-lg" />
              Salvar Ocorrência
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
