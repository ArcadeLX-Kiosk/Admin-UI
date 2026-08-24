import { Order } from '../types/order';

export const MOCK_ORDERS = [
  {
    "id": "ORD-2026-09-001",
    "requestedBy": "dist-1",
    "requestedByRole": "distributor",
    "requestedTo": "company",
    "requestedToRole": "company",
    "machineModel": "Kiosk-V2-Pro",
    "quantity": 10,
    "deliveryAddress": "123 Tech Park, Block C, Bengaluru",
    "status": "requested",
    "createdAt": "2026-09-05T09:00:00Z",
    "updatedAt": "2026-09-05T09:00:00Z",
    "orderNumber": "ORD-2026-09-001",
    "type": "machine_request",
    "remarks": "Need more machines for Diwali season.",
    "requestedDate": "2026-09-05T09:00:00Z",
    "direction": "distributor_to_company",
    "createdBy": "dist-1",
    "assignedMachineIds": [],
    "source": "portal_request"
  }
];
