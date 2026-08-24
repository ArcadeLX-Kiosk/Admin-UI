import { SupportTicket, SupportReply } from '../types/support';

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "TKT-2026-0012",
    subject: "Machine Offline",
    description: "Machine KSK-2026-000018 has been offline since yesterday morning.",
    category: "machine",
    priority: "high",
    status: "in_progress",
    createdBy: "dist-1",
    createdByName: "FunZone Distribution",
    role: "distributor",
    createdAt: "2026-08-23T09:00:00Z",
    updatedAt: "2026-08-23T14:30:00Z",
    relatedMachineId: "KSK-2026-000018"
  },
  {
    id: "TKT-2026-0011",
    subject: "Request Additional Machines",
    description: "Nexus Gaming Center needs 2 additional machines before the weekend.",
    category: "order",
    priority: "medium",
    status: "open",
    createdBy: "dist-1",
    createdByName: "FunZone Distribution",
    role: "distributor",
    createdAt: "2026-08-22T10:15:00Z",
    updatedAt: "2026-08-22T10:15:00Z",
  },
  {
    id: "TKT-2026-0009",
    subject: "Settlement Clarification",
    description: "Query regarding the July 2026 settlement calculation for the distributor share.",
    category: "settlement",
    priority: "medium",
    status: "resolved",
    createdBy: "dist-1",
    createdByName: "FunZone Distribution",
    role: "distributor",
    createdAt: "2026-08-10T11:00:00Z",
    updatedAt: "2026-08-12T15:20:00Z",
    relatedSettlementId: "cs-jul-dist1"
  },
  {
    id: "TKT-2026-0007",
    subject: "Firmware Issue",
    description: "Machine KSK-2026-000005 screen is unresponsive after update.",
    category: "machine",
    priority: "high",
    status: "closed",
    createdBy: "dist-1",
    createdByName: "FunZone Distribution",
    role: "distributor",
    createdAt: "2026-07-15T09:00:00Z",
    updatedAt: "2026-07-16T10:00:00Z",
    relatedMachineId: "KSK-2026-000005"
  },
  {
    id: "TKT-P-2026-0005",
    subject: "Machine Maintenance Request",
    description: "Joystick on KSK-2026-000001 is stuck and needs cleaning or replacement.",
    category: "machine",
    priority: "medium",
    status: "in_progress",
    createdBy: "part-1",
    createdByName: "Nexus Gaming Center",
    role: "partner",
    createdAt: "2026-08-24T08:00:00Z",
    updatedAt: "2026-08-24T09:30:00Z",
    relatedMachineId: "KSK-2026-000001"
  },
  {
    id: "TKT-P-2026-0004",
    subject: "Settlement query",
    description: "When will the August settlement be processed?",
    category: "settlement",
    priority: "medium",
    status: "open",
    createdBy: "part-1",
    createdByName: "Nexus Gaming Center",
    role: "partner",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-08-20T10:00:00Z",
    relatedSettlementId: "ps-aug-part1"
  },
  {
    id: "TKT-P-2026-0003",
    subject: "Payment Confirmation",
    description: "Confirming receipt of July payment.",
    category: "settlement",
    priority: "low",
    status: "closed",
    createdBy: "part-1",
    createdByName: "Nexus Gaming Center",
    role: "partner",
    createdAt: "2026-07-14T12:00:00Z",
    updatedAt: "2026-07-15T11:00:00Z",
    relatedSettlementId: "ps-jul-part1"
  },
  {
    id: "TKT-P-2026-0002",
    subject: "Additional Machine Request",
    description: "Looking to add a racing simulator to our current setup.",
    category: "order",
    priority: "medium",
    status: "resolved",
    createdBy: "part-1",
    createdByName: "Nexus Gaming Center",
    role: "partner",
    createdAt: "2026-06-05T14:00:00Z",
    updatedAt: "2026-06-10T16:00:00Z"
  }
];

export const MOCK_REPLIES: SupportReply[] = [];


