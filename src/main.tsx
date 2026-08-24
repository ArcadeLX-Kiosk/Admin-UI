import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './app/authContext.tsx'
import { OrgProvider } from './mock/orgContext.tsx'
import { MachineProvider } from './mock/machineContext.tsx'
import { OrderProvider } from './mock/orderContext.tsx'
import { RevenueProvider } from './mock/revenueContext.tsx'
import { SettlementProvider } from './mock/settlementContext.tsx'
import { NotificationProvider } from './mock/notificationContext.tsx'
import { AuditProvider } from './mock/auditContext.tsx'
import { SupportProvider } from './mock/supportContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OrgProvider>
          <NotificationProvider>
            <AuditProvider>
              <MachineProvider>
                <OrderProvider>
                  <RevenueProvider>
                    <SettlementProvider>
                      <SupportProvider>
                        <App />
                      </SupportProvider>
                    </SettlementProvider>
                  </RevenueProvider>
                </OrderProvider>
              </MachineProvider>
            </AuditProvider>
          </NotificationProvider>
        </OrgProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
