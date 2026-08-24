export type SupportTicketStatus = 'open' | 'in_progress' | 'waiting_for_response' | 'resolved' | 'closed';
export type SupportTicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type SupportTicketCategory = 'machine' | 'order' | 'payment' | 'revenue' | 'settlement' | 'account' | 'other';

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: SupportTicketPriority;
  category: SupportTicketCategory;
  status: SupportTicketStatus;
  createdBy: string;
  createdByName?: string;
  role: 'company' | 'distributor' | 'partner';
  recipientId?: string;
  createdAt: string;
  updatedAt: string;
  relatedMachineId?: string;
  relatedOrderId?: string;
  relatedSettlementId?: string;
}

export interface SupportReply {
  id: string;
  ticketId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}
