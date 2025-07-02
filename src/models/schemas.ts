// os dados do usuário o que ele precisa ter
export interface User {
  id: string;
  userName: string;
  email: string;
  password: string;
  imageUrl?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Event {
  // mesma coisa aqui o que o evento precisa ter
  id: string;
  eventName: string;
  eventDetails: string;
  eventDate: Date;
  eventLocal: string;
  duration: number;
  durationUnit?: "minutos" | "horas" | "dias";
  maxParticipants?: number;
  eventFormat: EventType;
  status: "ACTIVE" | "INACTIVE" | "CANCELLED";
  eventPublicity: EventPublicity;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  accessCode?: string | null;
  price: number;
}

export interface EventsAttendees {
  userId: string;
  eventId: string;
}

export enum EventType {
  "PRESENCIAL",
  "REMOTE",
}

export enum EventPublicity {
  "PUBLIC",
  "PRIVATE",
}
