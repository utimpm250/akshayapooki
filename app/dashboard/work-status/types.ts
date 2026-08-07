export interface WorkItem {
  id: string;

  service: string;

  name: string;

  phone: string;

  reference: string;

  date: string;

  staff: string;

  addedBy?: string;

  receiptUrl?: string;

  receiptType?: "image" | "pdf";

  status:
    | "Pending"
    | "Processing"
    | "Completed"
    | "Delivered";
}