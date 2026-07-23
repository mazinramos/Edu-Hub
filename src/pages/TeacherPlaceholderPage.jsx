import DashboardShell from '../components/DashboardShell'
import ComingSoon from '../components/ComingSoon'
import { teacherNavItems } from './TeacherCoursesPage'

export default function TeacherPlaceholderPage({ activeKey, label }) {
  return (
    <DashboardShell navItems={teacherNavItems} activeKey={activeKey} title={label}>
      <ComingSoon label={label} />
    </DashboardShell>
  )
}
