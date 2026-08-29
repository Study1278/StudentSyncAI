import AdminLayout from '../components/AdminLayout'
import AdminEntityList from '../components/AdminEntityList'

function AdminExams() {
  return (
    <AdminLayout title="Exams" subtitle="Every exam across all users">
      <AdminEntityList
        apiPath="/admin/exams"
        deleteLabel="exam"
        emptyText="No exams in the system yet."
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'subject_name', label: 'Subject' },
          { key: 'exam_date', label: 'Date', render: (i) => new Date(i.exam_date).toLocaleDateString() },
          { key: 'owner', label: 'Owner', render: (i) => `${i.owner_name} (${i.owner_email})` },
        ]}
      />
    </AdminLayout>
  )
}

export default AdminExams