'use client';

import { useState } from 'react';
import type { ClassRoom } from '../types';

type NewClassModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newClass: Omit<ClassRoom, 'id'>) => void;
};

export function NewClassModal({ isOpen, onClose, onSave }: NewClassModalProps) {
  const [grade, setGrade] = useState('');
  const [period, setPeriod] = useState('Manhã');
  const [time, setTime] = useState('07:30 - 11:30');
  const [school, setSchool] = useState('Escola Municipal Professora Helena Kolody');
  const [teacher, setTeacher] = useState('Lucas Silva');
  const [students, setStudents] = useState('25');

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!grade.trim()) return;

    onSave({
      grade: grade.trim(),
      period,
      time,
      school,
      teacher,
      students: parseInt(students, 10) || 20,
      status: 'scheduled',
      accent: period === 'Manhã' ? 'blue' : period === 'Tarde' ? 'teal' : 'violet',
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card compact" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div>
            <div className="modal-badge">
              <i className="bi bi-grid-plus" /> Turmas
            </div>
            <h2>Nova Turma</h2>
            <p>Cadastre uma nova turma e configure os dados iniciais.</p>
          </div>
          <button className="modal-close-btn" type="button" aria-label="Fechar modal" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group-grid">
              <label>
                Nome da Turma / Série
                <input
                  type="text"
                  placeholder="Ex: 9º Ano A"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                />
              </label>

              <label>
                Período
                <select
                  value={period}
                  onChange={(e) => {
                    setPeriod(e.target.value);
                    if (e.target.value === 'Manhã') setTime('07:30 - 11:30');
                    else if (e.target.value === 'Tarde') setTime('13:00 - 17:00');
                    else setTime('18:30 - 22:00');
                  }}
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </label>
            </div>

            <div className="form-group-grid">
              <label>
                Horário
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="07:30 - 11:30"
                  required
                />
              </label>

              <label>
                Qtd. Alunos Inicial
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={students}
                  onChange={(e) => setStudents(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-group-grid">
              <label>
                Unidade Escolar
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  required
                />
              </label>

              <label>
                Professor Responsável
                <input
                  type="text"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  placeholder="Ex: Prof. Lucas Silva"
                  required
                />
              </label>
            </div>
          </div>

          <footer className="modal-footer">
            <button className="secondary-action" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="primary-action" type="submit">
              <i className="bi bi-check-lg" />
              Criar Turma
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
