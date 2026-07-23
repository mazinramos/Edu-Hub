import DashboardShell from '../components/DashboardShell'
import ComingSoon from '../components/ComingSoon'
import { studentNavItems } from './StudentDashboard'

export default function StudentPlaceholderPage({ activeKey, label }) {
  return (
    <DashboardShell navItems={studentNavItems} activeKey={activeKey} title={label}>
      <ComingSoon label={label} />
    </DashboardShell>
  )
}
