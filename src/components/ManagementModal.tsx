'use client';

import { useMemo, useState } from 'react';
import type { ClassRoom, OperatorMember, StaffMember, Teacher } from '../types';

export type ManagementTab = 'professores' | 'secretaria' | 'operadores';

type ManagementModalProps = {
  isOpen: boolean;
  initialTab?: ManagementTab;
  classes: ClassRoom[];
  teachers: Teacher[];
  staff: StaffMember[];
  operators: OperatorMember[];
  onClose: () => void;
  onToast: (msg: string) => void;
};

export function ManagementModal({
  isOpen,
  initialTab = 'professores',
  classes,
  teachers: initialTeachers,
  staff,
  operators: initialOperators,
  onClose,
  onToast,
}: ManagementModalProps) {
  const [activeTab, setActiveTab] = useState<ManagementTab>(initialTab);
  const [teachersList, setTeachersList] = useState<Teacher[]>(initialTeachers);
  const [operatorsList, setOperatorsList] = useState<OperatorMember[]>(initialOperators);
  const [search, setSearch] = useState('');
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredTeachers = teachersList.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()),
  );

  function toggleClassLink(teacherId: string, classId: string) {
    setTeachersList((prev) =>
      prev.map((teacher) => {
        if (teacher.id !== teacherId) return teacher;
        const exists = teacher.classIds.includes(classId);
        const nextClassIds = exists
          ? teacher.classIds.filter((id) => id !== classId)
          : [...teacher.classIds, classId];
        return { ...teacher, classIds: nextClassIds };
      }),
    );
    onToast('Vínculo de turma atualizado!');
  }

  function toggleTeacherStatus(teacherId: string) {
    setTeachersList((prev) =>
      prev.map((t) => {
        if (t.id !== teacherId) return t;
        const nextStatus = t.status === 'active' ? 'inactive' : 'active';
        return { ...t, status: nextStatus };
      }),
    );
    onToast('Status do professor atualizado!');
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <header className="modal-header">
          <div>
            <div className="modal-badge">
              <i className="bi bi-shield-lock" /> Gestão Administrativa
            </div>
            <h2>Gestão Escolar</h2>
            <p>Gerenciamento de vínculos de professores, equipe de secretaria e operadores.</p>
          </div>
          <button className="modal-close-btn" type="button" aria-label="Fechar modal" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </header>

        {/* Modal Tabs */}
        <nav className="modal-tabs">
          <button
            className={activeTab === 'professores' ? 'active' : ''}
            type="button"
            onClick={() => setActiveTab('professores')}
          >
            <i className="bi bi-mortarboard" />
            <span>Professores ({teachersList.length})</span>
          </button>
          <button
            className={activeTab === 'secretaria' ? 'active' : ''}
            type="button"
            onClick={() => setActiveTab('secretaria')}
          >
            <i className="bi bi-person-gear" />
            <span>Secretaria ({staff.length})</span>
          </button>
          <button
            className={activeTab === 'operadores' ? 'active' : ''}
            type="button"
            onClick={() => setActiveTab('operadores')}
          >
            <i className="bi bi-person-plus" />
            <span>Operadores / Substitutos ({operatorsList.length})</span>
          </button>
        </nav>

        {/* Tab Content: Professores */}
        {activeTab === 'professores' && (
          <div className="modal-body">
            <div className="modal-toolbar">
              <div className="search-input-wrapper">
                <i className="bi bi-search" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar professor por nome, matéria ou e-mail..."
                />
              </div>
              <button
                className="primary-action compact"
                type="button"
                onClick={() => onToast('Formulário de novo professor aberto no protótipo.')}
              >
                <i className="bi bi-plus-lg" />
                Novo Professor
              </button>
            </div>

            <div className="management-list">
              {filteredTeachers.map((teacher) => (
                <article className="management-item" key={teacher.id}>
                  <div className="management-item-head">
                    <div className="user-profile-info">
                      <span className="user-avatar">{teacher.name.slice(0, 2)}</span>
                      <div>
                        <div className="user-name-row">
                          <strong>{teacher.name}</strong>
                          <span className={`status-pill ${teacher.status}`}>
                            {teacher.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <span className="user-meta">
                          <span>{teacher.subject}</span> · <small>{teacher.email}</small>
                        </span>
                      </div>
                    </div>

                    <div className="item-actions">
                      <button
                        className="secondary-action compact"
                        type="button"
                        onClick={() =>
                          setEditingTeacherId((prev) => (prev === teacher.id ? null : teacher.id))
                        }
                      >
                        <i className="bi bi-link-45deg" />
                        {editingTeacherId === teacher.id ? 'Fechar vínculos' : 'Gerenciar turmas'}
                      </button>
                      <button
                        className="icon-action-btn"
                        type="button"
                        title={teacher.status === 'active' ? 'Desativar professor' : 'Ativar professor'}
                        onClick={() => toggleTeacherStatus(teacher.id)}
                      >
                        <i className={`bi ${teacher.status === 'active' ? 'bi-toggle-on text-green' : 'bi-toggle-off'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Class Badges List */}
                  <div className="assigned-classes-row">
                    <span className="classes-label">Turmas vinculadas:</span>
                    {teacher.classIds.length === 0 ? (
                      <span className="no-classes">Nenhuma turma atribuída</span>
                    ) : (
                      teacher.classIds.map((cid) => {
                        const found = classes.find((c) => c.id === cid);
                        return (
                          <span className="class-badge" key={cid}>
                            {found ? `${found.grade} (${found.period})` : cid}
                          </span>
                        );
                      })
                    )}
                  </div>

                  {/* Inline Class Link Editor */}
                  {editingTeacherId === teacher.id && (
                    <div className="class-selector-drawer">
                      <p className="drawer-title">Marque as turmas que este professor leciona:</p>
                      <div className="class-checkbox-grid">
                        {classes.map((cls) => {
                          const isAssigned = teacher.classIds.includes(cls.id);
                          return (
                            <button
                              key={cls.id}
                              type="button"
                              className={`class-toggle-pill ${isAssigned ? 'assigned' : ''}`}
                              onClick={() => toggleClassLink(teacher.id, cls.id)}
                            >
                              <i className={`bi ${isAssigned ? 'bi-check-circle-fill' : 'bi-circle'}`} />
                              <span>
                                {cls.grade} · {cls.period}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Secretaria */}
        {activeTab === 'secretaria' && (
          <div className="modal-body">
            <div className="modal-toolbar">
              <p className="section-note">Membros com permissão de cadastro, organização de turmas e relatórios.</p>
              <button
                className="primary-action compact"
                type="button"
                onClick={() => onToast('Novo operador de secretaria adicionado no protótipo.')}
              >
                <i className="bi bi-person-plus" />
                Adicionar Secretaria
              </button>
            </div>

            <div className="management-list">
              {staff.map((member) => (
                <article className="management-item" key={member.id}>
                  <div className="management-item-head">
                    <div className="user-profile-info">
                      <span className="user-avatar staff">{member.name.slice(0, 2)}</span>
                      <div>
                        <strong>{member.name}</strong>
                        <span className="user-meta">
                          <span>{member.roleTitle}</span> · <small>{member.department}</small>
                        </span>
                      </div>
                    </div>
                    <span className="user-email-chip">{member.email}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Operadores / Substitutos */}
        {activeTab === 'operadores' && (
          <div className="modal-body">
            <div className="modal-toolbar">
              <p className="section-note">
                Operadores com acesso liberado temporário ou permanente para realizar chamada em substituições.
              </p>
              <button
                className="primary-action compact"
                type="button"
                onClick={() => onToast('Novo operador cadastrado no protótipo.')}
              >
                <i className="bi bi-person-badge" />
                Novo Substituto
              </button>
            </div>

            <div className="management-list">
              {operatorsList.map((op) => (
                <article className="management-item" key={op.id}>
                  <div className="management-item-head">
                    <div className="user-profile-info">
                      <span className="user-avatar operator">{op.name.slice(0, 2)}</span>
                      <div>
                        <div className="user-name-row">
                          <strong>{op.name}</strong>
                          <span className="status-pill blue">{op.accessType}</span>
                        </div>
                        <span className="user-meta">
                          <small>{op.email}</small>
                          {op.validUntil && <span> · Válido até {op.validUntil}</span>}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="assigned-classes-row">
                    <span className="classes-label">Turmas autorizadas:</span>
                    {op.authorizedClassIds.map((cid) => {
                      const found = classes.find((c) => c.id === cid);
                      return (
                        <span className="class-badge" key={cid}>
                          {found ? `${found.grade} (${found.period})` : cid}
                        </span>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <footer className="modal-footer">
          <button className="secondary-action" type="button" onClick={onClose}>
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );
}
