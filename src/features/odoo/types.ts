export type OdooEmployee = {
  id: number;
  name: string;
  workEmail?: string;
  image128?: string;
  userId?: number;
};

export type OdooMeeting = {
  id: number;
  title: string;
  start: string;
  end: string;
};
