import { useMemo, useState } from 'react';
import { classes as initialClasses, historyRecords as initialHistory, operatorMembers, roles, staffMembers, students as initialStudents, teachers } from './data';
import { AuthScreen, RecoverScreen } from './components/AuthScreens';
import { ClassDetailsModal } from './components/ClassDetailsModal';
import { HistoryModal } from './components/HistoryModal';
import { ImportStudentsModal } from './components/ImportStudentsModal';
import { ManagementModal, type ManagementTab } from './components/ManagementModal';
import { NewClassModal } from './components/NewClassModal';
import { ObservationHistoryModal } from './components/ObservationHistoryModal';
import { ObservationModal } from './components/ObservationModal';
import { Shell } from './components/Shell';
import { StudentModal } from './components/StudentModal';
import { AttendanceView, ClassesView, ConsultationView, DashboardView, SettingsView } from './components/Views';
import type { ClassRoom, HistoryRecord, RoleId, Student, StudentObservation, StudentStatus, ViewId } from './types';

const routeMap: Record<string, ViewId> = {
  inicio: 'inicio',
  turmas: 'turmas',
  turma: 'turmas',
  chamada: 'turmas',
  alunos: 'consulta',
  historico: 'consulta',
  relatorios: 'consulta',
  configuracoes: 'configuracoes',
};

function getInitialRole(): RoleId {
  if (typeof window === 'undefined') return 'professor';
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('perfil');
  const stored = localStorage.getItem('arauRole');

  if (fromUrl && roles.some((role) => role.id === fromUrl)) return fromUrl as RoleId;
  if (stored && roles.some((role) => role.id === stored)) return stored as RoleId;
  return 'professor';
}

function getInitialView(): ViewId {
  if (typeof window === 'undefined') return 'inicio';
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('view');
  const pathKey = window.location.pathname.replace(/\.html$/, '').replace(/^\//, '') || 'inicio';

  if (fromQuery && Object.values(routeMap).includes(fromQuery as ViewId)) return fromQuery as ViewId;
  return routeMap[pathKey] ?? 'inicio';
}

function getInitialAuth() {
  if (typeof window === 'undefined') return 'login';
  const params = new URLSearchParams(window.location.search);
  if (params.get('auth') === 'recover' || window.location.pathname.includes('esqueci-senha')) return 'recover';
  return localStorage.getItem('arauAuthenticated') === 'true' ? 'app' : 'login';
}

function updateAddress(view: ViewId, role: RoleId) {
  const params = new URLSearchParams({ view, perfil: role });
  window.history.pushState(null, '', `/?${params.toString()}`);
}

export default function App() {
  const [authView, setAuthView] = useState<'login' | 'recover' | 'app'>(getInitialAuth);
  const [roleId, setRoleId] = useState<RoleId>(getInitialRole);
  const [view, setView] = useState<ViewId>(getInitialView);
  const [classesList, setClassesList] = useState<ClassRoom[]>(initialClasses);
  const [studentsList, setStudentsList] = useState<Student[]>(initialStudents);
  const [historyList, setHistoryList] = useState<HistoryRecord[]>(initialHistory);
  const [selectedClassId, setSelectedClassId] = useState('6a');
  const [consultaClassId, setConsultaClassId] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'all'>('all');
  const [toast, setToast] = useState('');

  // Modals state - Only 1 active modal at a time
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isNewClassOpen, setIsNewClassOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTargetClass, setImportTargetClass] = useState<ClassRoom | null>(null);
  const [managementTab, setManagementTab] = useState<ManagementTab>('professores');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<HistoryRecord | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [observationStudent, setObservationStudent] = useState<Student | null>(null);
  const [observationStatus, setObservationStatus] = useState<StudentStatus>('present');
  const [isObservationOpen, setIsObservationOpen] = useState(false);
  const [historyObsStudent, setHistoryObsStudent] = useState<Student | null>(null);
  const [isHistoryObsOpen, setIsHistoryObsOpen] = useState(false);
  const [managingClassRoom, setManagingClassRoom] = useState<ClassRoom | null>(null);
  const [isClassDetailsOpen, setIsClassDetailsOpen] = useState(false);

  const role = useMemo(() => roles.find((item) => item.id === roleId) ?? roles[2], [roleId]);

  // Dynamic class list with live student counts calculated from actual studentsList
  const dynamicClasses = useMemo(() => {
    return classesList.map((cls) => {
      const actualCount = studentsList.filter((s) => s.classId === cls.id).length;
      return {
        ...cls,
        students: actualCount,
      };
    });
  }, [classesList, studentsList]);

  // Filter classes tailored to role
  const userClasses = useMemo(() => {
    if (role.id === 'professor') {
      // Professor Lucas Silva only sees his assigned classes
      return dynamicClasses.filter((cls) => cls.teacher === 'Lucas Silva' || cls.id === '6a' || cls.id === '7b');
    }
    if (role.id === 'operador') {
      // Operator sees authorized classes for substitute coverage
      return dynamicClasses.filter((cls) => cls.id === '8a' || cls.id === '6a');
    }
    // Diretor and Secretaria see all school classes
    return dynamicClasses;
  }, [dynamicClasses, role.id]);

  const selectedClass = dynamicClasses.find((item) => item.id === selectedClassId) ?? dynamicClasses[0];
  const scopedStudents = studentsList.filter((student) => student.classId === selectedClass.id);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function closeAllModals() {
    setIsManagementOpen(false);
    setIsNewClassOpen(false);
    setIsImportModalOpen(false);
    setIsStudentModalOpen(false);
    setIsHistoryModalOpen(false);
    setIsObservationOpen(false);
    setIsHistoryObsOpen(false);
    setIsClassDetailsOpen(false);
  }

  function handleLogin(nextRole: RoleId) {
    localStorage.setItem('arauAuthenticated', 'true');
    localStorage.setItem('arauRole', nextRole);
    setRoleId(nextRole);
    setAuthView('app');
    setView('inicio');
    updateAddress('inicio', nextRole);
  }

  function handleRoleChange(nextRole: RoleId) {
    localStorage.setItem('arauRole', nextRole);
    setRoleId(nextRole);
    updateAddress(view, nextRole);
  }

  function handleNavigate(nextView: ViewId) {
    setView(nextView);
    updateAddress(nextView, roleId);
  }

  function openManagementModal(tab: ManagementTab = 'professores') {
    closeAllModals();
    setManagementTab(tab);
    setIsManagementOpen(true);
  }

  function handleCreateClass(newClassData: Omit<ClassRoom, 'id'>) {
    const newId = `class-${Date.now()}`;
    const newClass: ClassRoom = { id: newId, ...newClassData, students: 0 };
    setClassesList((prev) => [...prev, newClass]);
    setSelectedClassId(newId);
    showToast(`Turma ${newClass.grade} criada com sucesso!`);
  }

  function handleSaveStudent(updated: Student) {
    setStudentsList((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast(`Dados de ${updated.name} atualizados com sucesso!`);
  }

  function handleSaveHistoryRecord(updatedRecord: HistoryRecord) {
    setHistoryList((prev) => prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r)));
    showToast(`Registro de chamada de ${updatedRecord.date} atualizado!`);
  }

  function handleOpenStudent(student: Student) {
    closeAllModals();
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  }

  function handleOpenHistory(record: HistoryRecord) {
    closeAllModals();
    setSelectedHistoryRecord(record);
    setIsHistoryModalOpen(true);
  }

  function handleOpenObservation(student: Student, currentStatus: StudentStatus = 'present') {
    closeAllModals();
    setObservationStudent(student);
    setObservationStatus(currentStatus);
    setIsObservationOpen(true);
  }

  function handleViewObservationHistory(student: Student) {
    closeAllModals();
    setHistoryObsStudent(student);
    setIsHistoryObsOpen(true);
  }

  function handleManageClass(classRoom: ClassRoom) {
    closeAllModals();
    setManagingClassRoom(classRoom);
    setIsClassDetailsOpen(true);
  }

  function handleOpenImport(targetClass?: ClassRoom) {
    closeAllModals();
    setImportTargetClass(targetClass || null);
    setIsImportModalOpen(true);
  }

  function handleImportStudents(imported: Omit<Student, 'id'>[]) {
    const newStudentsWithIds: Student[] = imported.map((item, idx) => ({
      id: Date.now() + idx,
      ...item,
    }));
    setStudentsList((prev) => [...prev, ...newStudentsWithIds]);
  }

  function handleAddStudentToClass(
    classId: string,
    studentData: { matricula: string; name: string; responsible: string; phone: string },
  ) {
    const newStudent: Student = {
      id: Date.now(),
      matricula: studentData.matricula,
      name: studentData.name,
      classId,
      status: 'present',
      rate: 100,
      responsible: studentData.responsible,
      phone: studentData.phone,
      birthDate: '15/06/2012',
      observations: [],
    };
    setStudentsList((prev) => [...prev, newStudent]);
    showToast(`Aluno ${studentData.name} matriculado com sucesso!`);
  }

  function handleSaveObservation(studentId: number, observation: StudentObservation) {
    setStudentsList((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          observations: [observation, ...(s.observations || [])],
        };
      }),
    );
  }

  if (authView === 'recover') {
    return <RecoverScreen onBack={() => setAuthView('login')} onSubmit={() => showToast('Instruções enviadas para o e-mail informado.')} />;
  }

  if (authView === 'login') {
    return <AuthScreen initialRole={roleId} onRecover={() => setAuthView('recover')} onLogin={handleLogin} />;
  }

  return (
    <>
      <Shell
        currentView={view}
        role={role}
        toast={toast}
        onLogout={() => {
          localStorage.removeItem('arauAuthenticated');
          setAuthView('login');
          window.history.pushState(null, '', '/');
        }}
        onNavigate={handleNavigate}
        onRoleChange={handleRoleChange}
      >
        {view === 'inicio' && (
          <DashboardView
            classes={userClasses}
            role={role}
            selectedClass={selectedClass}
            onClassSelect={(classId) => {
              setSelectedClassId(classId);
              handleNavigate('chamada');
            }}
            onNavigate={handleNavigate}
            onOpenManagement={openManagementModal}
          />
        )}
        {view === 'turmas' && (
          <ClassesView
            classes={userClasses}
            role={role}
            onAttendance={(classId) => {
              setSelectedClassId(classId);
              handleNavigate('chamada');
            }}
            onNewClass={() => {
              closeAllModals();
              setIsNewClassOpen(true);
            }}
            onManageClass={handleManageClass}
          />
        )}
        {view === 'chamada' && (
          <AttendanceView
            classRoom={selectedClass}
            students={scopedStudents}
            onSave={() => {
              showToast(`Chamada do ${selectedClass.grade} salva com sucesso!`);
              handleNavigate('turmas');
            }}
            onCancel={() => handleNavigate('turmas')}
            onOpenObservation={handleOpenObservation}
          />
        )}
        {view === 'consulta' && (
          <ConsultationView
            classes={userClasses}
            historyRecords={historyList}
            role={role}
            search={search}
            selectedClassId={consultaClassId}
            statusFilter={statusFilter}
            students={studentsList}
            onClassChange={setConsultaClassId}
            onExport={() => showToast('Relatório CSV exportado com sucesso!')}
            onSearch={setSearch}
            onStatusFilter={setStatusFilter}
            onSelectStudent={handleOpenStudent}
            onSelectHistoryRecord={handleOpenHistory}
            onViewObservationHistory={handleViewObservationHistory}
          />
        )}
        {view === 'configuracoes' && <SettingsView role={role} onSave={() => showToast('Preferências salvas com sucesso.')} />}
      </Shell>

      <ManagementModal
        isOpen={isManagementOpen}
        initialTab={managementTab}
        classes={dynamicClasses}
        teachers={teachers}
        staff={staffMembers}
        operators={operatorMembers}
        onClose={() => setIsManagementOpen(false)}
        onToast={showToast}
      />

      <NewClassModal
        isOpen={isNewClassOpen}
        onClose={() => setIsNewClassOpen(false)}
        onSave={handleCreateClass}
      />

      <ImportStudentsModal
        isOpen={isImportModalOpen}
        targetClass={importTargetClass}
        classes={dynamicClasses}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportStudents}
        onToast={showToast}
      />

      <StudentModal
        student={selectedStudent}
        isOpen={isStudentModalOpen}
        classes={dynamicClasses}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        onToast={showToast}
      />

      <HistoryModal
        record={selectedHistoryRecord}
        isOpen={isHistoryModalOpen}
        role={role}
        classes={dynamicClasses}
        students={studentsList}
        onClose={() => setIsHistoryModalOpen(false)}
        onSaveRecord={handleSaveHistoryRecord}
        onToast={showToast}
      />

      <ObservationModal
        student={observationStudent}
        classRoom={selectedClass}
        currentStatus={observationStatus}
        isOpen={isObservationOpen}
        onClose={() => setIsObservationOpen(false)}
        onSaveObservation={handleSaveObservation}
        onToast={showToast}
      />

      <ObservationHistoryModal
        student={historyObsStudent}
        isOpen={isHistoryObsOpen}
        onClose={() => setIsHistoryObsOpen(false)}
      />

      <ClassDetailsModal
        classRoom={managingClassRoom}
        isOpen={isClassDetailsOpen}
        role={role}
        allClasses={dynamicClasses}
        students={studentsList}
        teachers={teachers}
        onClose={() => setIsClassDetailsOpen(false)}
        onAttendance={(classId) => {
          setSelectedClassId(classId);
          handleNavigate('chamada');
        }}
        onOpenStudent={handleOpenStudent}
        onViewObservationHistory={handleViewObservationHistory}
        onOpenImport={handleOpenImport}
        onAddStudent={handleAddStudentToClass}
        onToast={showToast}
      />
    </>
  );
}



