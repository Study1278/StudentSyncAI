import AdminLayout from '../components/AdminLayout'
import AdminEntityList from '../components/AdminEntityList'

function AdminAssignments() {
  return (
    <AdminLayout title="Assignments" subtitle="Every assignment across all users">
      <AdminEntityList
        apiPath="/admin/assignments"
        deleteLabel="assignment"
        emptyText="No assignments in the system yet."
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'subject_name', label: 'Subject' },
          { key: 'status', label: 'Status' },
          { key: 'owner', label: 'Owner', render: (i) => `${i.owner_name} (${i.owner_email})` },
        ]}
      />
    </AdminLayout>
  )
}

export default AdminAssignments