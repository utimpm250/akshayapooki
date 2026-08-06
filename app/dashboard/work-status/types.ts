export interface WorkItem {
  id: string;

  service: string;

  name: string;

  phone: string;

  reference: string;

  date: string;

  staff: string;

  status:
    | "Pending"
    | "Processing"
    | "Completed"
    | "Delivered";
}