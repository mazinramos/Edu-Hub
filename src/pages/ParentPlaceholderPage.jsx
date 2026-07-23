import DashboardShell from '../components/DashboardShell'
import ComingSoon from '../components/ComingSoon'
import { parentNavItems } from './ParentDashboard'

export default function ParentPlaceholderPage({ activeKey, label }) {
  return (
    <DashboardShell navItems={parentNavItems} activeKey={activeKey} title={label}>
      <ComingSoon label={label} />
    </DashboardShell>
  )
}
