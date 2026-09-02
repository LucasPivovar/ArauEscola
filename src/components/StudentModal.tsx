'use client';

import { useState, useEffect } from 'react';
import type { ClassRoom, Student, StudentStatus } from '../types';

type StudentModalProps = {
  student: Student | null;
  isOpen: boolean;
  classes: ClassRoom[];
  onClose: () => void;
  onSave: (updated: Student) => void;
  onToast: (msg: string) => void;
};

const statusLabels: Record<StudentStatus, { label: string; className: string }> = {
  present: { label: 'Presente', className: 'present' },
  absent: { label: 'Falta', className: 'absent' },
  late: { label: 'Atraso', className: 'late' },
  excused: { label: 'Justificada', className: 'excused' },
  open: { label: 'Pendente', className: 'open' },
};

export function StudentModal({
  student,
  isOpen,
  classes,
  onClose,
  onSave,
}: StudentModalProps) {
  const [formData, setFormData] = useState<Student | null>(student);

  useEffect(() => {
    setFormData(student);
  }, [student]);

  if (!isOpen || !formData) return null;

  const currentClass = classes.find((c) => c.id === formData.classId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData) return;
    onSave(formData);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card student-detail-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="student-modal-header-info">
            <span className="student-modal-avatar">{formData.name.slice(0, 2)}</span>
            <div>
              <div className="modal-badge">
                <i className="bi bi-person-badge" /> Ficha Cadastral do Aluno
              </div>
              <h2>{formData.name}</h2>
              <p>Turma atual: <strong>{currentClass ? `${currentClass.grade} (${currentClass.period})` : formData.classId}</strong></p>
            </div>
          </div>
          <button className="modal-close-btn" type="button" aria-label="Fechar modal" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Quick Stats Grid */}
            <div className="student-quick-stats">
              <div className="quick-stat-item">
                <span className="stat-label">Frequência Geral</span>
                <strong className={`stat-val ${formData.rate >= 90 ? 'text-green' : formData.rate >= 80 ? 'text-orange' : 'text-red'}`}>
                  {formData.rate}%
                </strong>
              </div>
              <div className="quick-stat-item">
                <span className="stat-label">Status Atual</span>
                <span className="status-pill active">Matriculado(a)</span>
              </div>
              <div className="quick-stat-item">
                <span className="stat-label">Nascimento</span>
                <strong>{formData.birthDate || '10/05/2012'}</strong>
              </div>
            </div>

            {/* Editable Fields: Matricula, Nome, Turma */}
            <div className="form-group-grid">
              <label>
                Número de Matrícula
                <input
                  type="text"
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  placeholder="Ex: 2024-00124"
                  required
                />
              </label>

              <label>
                Transferir / Manejar para Turma
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.grade} - {cls.period} ({cls.school})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-group-grid">
              <label>
                Nome Completo do Aluno
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>

              <label>
                Nome do Responsável
                <input
                  type="text"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  required
                />
              </label>
            </div>

            <div className="form-group-grid">
              <label>
                Telefone / WhatsApp de Contato
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(41) 90000-0000"
                />
              </label>

              <label>
                Data de Nascimento
                <input
                  type="text"
                  value={formData.birthDate || ''}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  placeholder="DD/MM/AAAA"
                />
              </label>
            </div>

            {/* Observations / Occurrences Timeline View */}
            <div className="observations-section">
              <div className="section-title compact">
                <div>
                  <h3>Histórico de Ocorrências e Observações</h3>
                  <p>Registros disciplinares e de chamada realizados em sala.</p>
                </div>
              </div>

              <div className="obs-timeline-list">
                {(!formData.observations || formData.observations.length === 0) ? (
                  <p className="no-obs">Nenhuma ocorrência registrada para este aluno.</p>
                ) : (
                  formData.observations.map((obs) => (
                    <article className="obs-timeline-card compact" key={obs.id || `${obs.date}-${obs.time}`}>
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
                          <span className={`status-badge ${statusLabels[obs.status]?.className || 'present'}`}>
                            {statusLabels[obs.status]?.label || 'Presente'}
                          </span>
                        </div>
                      </div>

                      <div className="obs-card-body">
                        <p className="obs-description-text">{obs.description}</p>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          <footer className="modal-footer">
            <button className="secondary-action" type="button" onClick={onClose}>
              Fechar
            </button>
            <button className="primary-action" type="submit">
              <i className="bi bi-check-lg" />
              Salvar Alterações
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
