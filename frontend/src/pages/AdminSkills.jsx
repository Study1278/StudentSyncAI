import AdminLayout from '../components/AdminLayout'
import AdminEntityList from '../components/AdminEntityList'

function AdminSkills() {
  return (
    <AdminLayout title="Skills" subtitle="Every skill across all users">
      <AdminEntityList
        apiPath="/admin/skills"
        deleteLabel="skill"
        emptyText="No skills in the system yet."
        columns={[
          { key: 'name', label: 'Skill' },
          { key: 'proficiency', label: 'Proficiency' },
          { key: 'owner', label: 'Owner', render: (i) => `${i.owner_name} (${i.owner_email})` },
        ]}
      />
    </AdminLayout>
  )
}

export default AdminSkills