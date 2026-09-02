'use client';

import { useState } from 'react';
import type { ClassRoom, Student } from '../types';

type ImportStudentsModalProps = {
  isOpen: boolean;
  targetClass: ClassRoom | null;
  classes: ClassRoom[];
  onClose: () => void;
  onImport: (students: Omit<Student, 'id'>[]) => void;
  onToast: (msg: string) => void;
};

const sampleCsvData = `Matrícula,Nome,Responsável,Telefone
2024-00401,Lucas Gabriel Martins,Renata Martins,(41) 99111-2233
2024-00402,Mariana Silveira Costa,Fernando Costa,(41) 99222-3344
2024-00403,Pedro Henrique Dias,Amanda Dias,(41) 99333-4455
2024-00404,Sofia Helena Carvalho,Patricia Carvalho,(41) 99444-5566
2024-00405,Thiago Alves Ramos,Julio Ramos,(41) 99555-6677`;

export function ImportStudentsModal({
  isOpen,
  targetClass,
  classes,
  onClose,
  onImport,
  onToast,
}: ImportStudentsModalProps) {
  const [selectedClassId, setSelectedClassId] = useState(targetClass?.id || classes[0]?.id || '6a');
  const [csvText, setCsvText] = useState(sampleCsvData);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentTargetClass = classes.find((c) => c.id === selectedClassId) || targetClass || classes[0];

  function handleProcessImport() {
    setIsProcessing(true);
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) {
      onToast('O arquivo ou texto CSV precisa conter pelo menos um aluno.');
      setIsProcessing(false);
      return;
    }

    const importedStudents: Omit<Student, 'id'>[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const [matricula, name, responsible, phone] = line.split(',').map((item) => item.trim());

      if (name) {
        importedStudents.push({
          matricula: matricula || `2024-${Math.floor(10000 + Math.random() * 90000)}`,
          name,
          classId: selectedClassId,
          status: 'present',
          rate: 100,
          responsible: responsible || 'Responsável Legal',
          phone: phone || '(41) 90000-0000',
          birthDate: '15/06/2012',
          observations: [],
        });
      }
    }

    onImport(importedStudents);
    setIsProcessing(false);
    onToast(`${importedStudents.length} alunos importados com sucesso para o ${currentTargetClass?.grade}!`);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card import-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="import-modal-header-info">
            <span className="import-icon-badge">
              <i className="bi bi-file-earmark-spreadsheet-fill" />
            </span>
            <div>
              <div className="modal-badge">
                <i className="bi bi-upload" /> Importação em Lote
              </div>
              <h2>Importar Alunos (CSV / Excel)</h2>
              <p>Cadastre múltiplos alunos de uma só vez para a turma selecionada.</p>
            </div>
          </div>
          <button className="modal-close-btn" type="button" aria-label="Fechar modal" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <div className="modal-body">
          <div className="form-group-grid">
            <label>
              Turma de Destino
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.grade} - {cls.period} ({cls.school})
                  </option>
                ))}
              </select>
            </label>

            <div className="import-dropzone">
              <i className="bi bi-cloud-arrow-up text-blue" />
              <div>
                <strong>Carregar arquivo CSV / Planilha</strong>
                <small>Formatos aceitos: .csv, .xlsx</small>
              </div>
            </div>
          </div>

          <label className="obs-textarea-label">
            <span>Pré-visualização dos dados (formato: Matrícula, Nome, Responsável, Telefone):</span>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Cole os dados separados por vírgula..."
            />
          </label>

          <div className="import-instructions-box">
            <i className="bi bi-info-circle text-blue" />
            <span>
              Os alunos importados serão vinculados automaticamente ao <strong>{currentTargetClass?.grade}</strong> com frequência inicial de 100% e matrícula ativa.
            </span>
          </div>
        </div>

        <footer className="modal-footer">
          <button className="secondary-action" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="primary-action"
            type="button"
            onClick={handleProcessImport}
            disabled={isProcessing}
          >
            <i className="bi bi-check2-circle" />
            Confirmar Importação de Alunos
          </button>
        </footer>
      </div>
    </div>
  );
}
