export interface Classroom {
  id: string;
  name: string;
  section: string;
  subject: string;
  theme: string;
  studentCount: number;
  assignmentCount: number;
  roomCode: string;
  teacherName: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  endTime?: string;
  type: "class" | "meeting" | "break";
  location?: string;
  classroomId?: string;
}

export interface UpcomingItem {
  id: string;
  title: string;
  dueLabel: string;
  type: "assignment" | "exam" | "event";
  classroomName: string;
  urgent?: boolean;
}
