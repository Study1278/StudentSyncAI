import AdminLayout from '../components/AdminLayout'
import AdminEntityList from '../components/AdminEntityList'

function AdminSubjects() {
  return (
    <AdminLayout title="Subjects" subtitle="Every subject across all users">
      <AdminEntityList
        apiPath="/admin/subjects"
        deleteLabel="subject"
        emptyText="No subjects in the system yet."
        columns={[
          { key: 'name', label: 'Subject' },
          { key: 'code', label: 'Code' },
          { key: 'credits', label: 'Credits' },
          { key: 'owner', label: 'Owner', render: (i) => `${i.owner_name} (${i.owner_email})` },
        ]}
      />
    </AdminLayout>
  )
}

export default AdminSubjects