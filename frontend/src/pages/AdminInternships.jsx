import AdminLayout from '../components/AdminLayout'
import AdminEntityList from '../components/AdminEntityList'

function AdminInternships() {
  return (
    <AdminLayout title="Internships" subtitle="Every application across all users">
      <AdminEntityList
        apiPath="/admin/internships"
        deleteLabel="internship application"
        emptyText="No internship applications in the system yet."
        columns={[
          { key: 'company_name', label: 'Company' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner', render: (i) => `${i.owner_name} (${i.owner_email})` },
        ]}
      />
    </AdminLayout>
  )
}

export default AdminInternships