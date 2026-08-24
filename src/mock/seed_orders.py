import json
import re

def update_file(filename, replacement_map):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    for pattern, new_val in replacement_map.items():
        content = re.sub(pattern, new_val, content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. Orders
orders = """export const MOCK_ORDERS: any[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-2026-08-1001',
    createdBy: 'part-1',
    createdByRole: 'partner',
    requestedBy: 'part-1',
    requestedByRole: 'partner',
    requestedTo: 'dist-1',
    requestedToRole: 'distributor',
    direction: 'partner_to_distributor',
    type: 'additional_machines',
    quantity: 5,
    assignedMachineIds: [],
    status: 'completed',
    source: 'portal_request',
    remarks: 'Request additional machines for new location',
    createdAt: '2026-06-01T10:00:00Z',
    requestedDate: '2026-06-01T10:00:00Z',
    approvedAt: '2026-06-02T14:00:00Z',
    completedAt: '2026-06-10T11:00:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'ORD-2026-08-1002',
    createdBy: 'part-1',
    createdByRole: 'partner',
    requestedBy: 'part-1',
    requestedByRole: 'partner',
    requestedTo: 'dist-1',
    requestedToRole: 'distributor',
    direction: 'partner_to_distributor',
    type: 'machine_request',
    quantity: 2,
    assignedMachineIds: [],
    status: 'approved',
    source: 'portal_request',
    remarks: 'Standard partner machine request',
    createdAt: '2026-07-05T09:30:00Z',
    requestedDate: '2026-07-05T09:30:00Z',
    approvedAt: '2026-07-06T10:15:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'ORD-2026-08-1003',
    createdBy: 'dist-1',
    createdByRole: 'distributor',
    requestedBy: 'dist-1',
    requestedByRole: 'distributor',
    requestedTo: 'comp-1',
    requestedToRole: 'company',
    direction: 'distributor_to_company',
    type: 'machine_request',
    quantity: 10,
    assignedMachineIds: [],
    status: 'dispatched',
    source: 'portal_request',
    remarks: 'Restock inventory',
    createdAt: '2026-08-12T14:45:00Z',
    requestedDate: '2026-08-12T14:45:00Z',
    approvedAt: '2026-08-13T09:00:00Z',
    dispatchedAt: '2026-08-15T09:00:00Z'
  },
  {
    id: 'ord-1004',
    orderNumber: 'ORD-2026-08-1004',
    createdBy: 'comp-1',
    createdByRole: 'company',
    requestedBy: 'comp-1',
    requestedByRole: 'company',
    requestedTo: 'dist-1',
    requestedToRole: 'distributor',
    direction: 'company_to_distributor',
    type: 'machine_allocation',
    quantity: 8,
    assignedMachineIds: [],
    status: 'delivered',
    source: 'portal_request',
    remarks: 'Proactive machine allocation for upcoming season',
    createdAt: '2026-07-20T16:20:00Z',
    requestedDate: '2026-07-20T16:20:00Z',
    approvedAt: '2026-07-21T10:00:00Z',
    dispatchedAt: '2026-07-22T10:00:00Z',
    deliveredAt: '2026-07-25T10:00:00Z'
  },
  {
    id: 'ord-1005',
    orderNumber: 'ORD-2026-08-1005',
    createdBy: 'part-1',
    createdByRole: 'partner',
    requestedBy: 'part-1',
    requestedByRole: 'partner',
    requestedTo: 'dist-1',
    requestedToRole: 'distributor',
    direction: 'partner_to_distributor',
    type: 'return_request',
    quantity: 1,
    assignedMachineIds: ['mach-5'],
    status: 'cancelled',
    source: 'portal_request',
    remarks: 'Requested return but issue was resolved locally',
    createdAt: '2026-08-22T11:10:00Z',
    requestedDate: '2026-08-22T11:10:00Z'
  },
  {
    id: 'ord-1006',
    orderNumber: 'ORD-2026-08-1006',
    createdBy: 'dist-1',
    createdByRole: 'distributor',
    requestedBy: 'dist-1',
    requestedByRole: 'distributor',
    requestedTo: 'comp-1',
    requestedToRole: 'company',
    direction: 'distributor_to_company',
    type: 'machine_request',
    quantity: 3,
    assignedMachineIds: [],
    status: 'under_review',
    source: 'portal_request',
    remarks: 'Urgent request for high traffic location',
    createdAt: '2026-08-23T08:00:00Z',
    requestedDate: '2026-08-23T08:00:00Z'
  }
];"""

update_file('src/mock/orderData.ts', {
    r'export const MOCK_ORDERS: any\[\] = \[[\s\S]*?\n\];': orders
})
