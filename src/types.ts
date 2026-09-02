export type RoleId = 'diretor' | 'secretaria' | 'professor' | 'operador';

export type ViewId = 'inicio' | 'turmas' | 'chamada' | 'consulta' | 'configuracoes';

export type Role = {
  id: RoleId;
  label: string;
  name: string;
  initials: string;
  mode: 'admin' | 'routine';
  description: string;
  scope: string;
};

export type NavItem = {
  id: ViewId;
  label: string;
  icon: string;
};

export type ClassRoom = {
  id: string;
  grade: string;
  period: string;
  time: string;
  school: string;
  students: number;
  teacher: string;
  status: 'pending' | 'scheduled' | 'next';
  accent: 'teal' | 'blue' | 'violet';
};

export type StudentStatus = 'present' | 'absent' | 'late' | 'excused' | 'open';

export type StudentObservation = {
  id: string;
  date: string;
  time: string;
  teacher: string;
  subject: string;
  status: StudentStatus;
  description: string;
};

export type Student = {
  id: number;
  matricula: string;
  name: string;
  classId: string;
  status: StudentStatus;
  rate: number;
  responsible: string;
  phone: string;
  birthDate: string;
  observations: StudentObservation[];
};

export type HistoryRecord = {
  id: string;
  date: string;
  classId: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  isLocked: boolean;
  editRequested?: boolean;
  studentRecords?: Record<number, StudentStatus>;
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  subject: string;
  classIds: string[];
  status: 'active' | 'inactive';
};

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  department: string;
};

export type OperatorMember = {
  id: string;
  name: string;
  email: string;
  authorizedClassIds: string[];
  accessType: 'Temporário' | 'Permanente';
  validUntil?: string;
};


