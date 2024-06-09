import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Loading from '../../Components/Loading/Loading'

export default function Report() {
  const [isUpdate, setIsUpdate] = useState(false) // Güncelleme butonu durumu
  const[animals,setAnimals]=useState([])
  const [filteredAnimals,setFilteredAnimals]=useState([])

  const [appointment, setAppointment] = useState([])
  const [reports, setReports] = useState([]) // Report durumu
  const [filteredReport, setFilteredReport] = useState([]) // Filtrelenmiş report durumu
  const [update, setUpdate] = useState(false) // Güncelleme durumu
  const [searchQuery, setSearchQuery] = useState('') // Arama sorgusu durumu
  const [selectedReportId, setSelectedReportId] = useState('')

  const [isSnackbar, setIsSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  //report listeleme durumu
  const [isOpen, setIsOpen] = useState(false)

  const [newReport, setNewReport] = useState({
    //yeni report durumu
    title: '',
    diagnosis: '',
    price: '',
    appointmentId: '',
  })

  const [updateReport, setUpdateReport] = useState({
    // güncellenecek Report durumu
    id: '',
    title: '',
    diagnosis: '',
    price: '',
    appointmentId: '',
  })

  //backend ten reportları getirme isteği
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
         
           `${import.meta.env.VITE_APP_BASEURL}/api/v1/reports?pageNumber=0&pageSize=10`
        )
        setReports(response.data.content)
        setFilteredReport(response.data.content)
        setUpdate(true)
      } catch (error) {
        console.error('Hata:', error)
        setSnackbarMessage('report ' + error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }

    fetchReport()
  }, [update])

  // Backend'ten hayvanları getirme isteği
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get(
          
            `${import.meta.env.VITE_APP_BASEURL}/api/v1/animals?pageNumber=0&pageSize=10`
        )
        setAnimals(response.data.content)
        setFilteredAnimals(response.data.content)
        setUpdate(true)
      } catch (error) {
        console.error('Error:', error)
        setSnackbarMessage('animals ' + error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }

    fetchAnimals()
  }, [update])

  //appointment backend sorgu
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          
           `${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments?pageNumber=0&pageSize=10`
        )
        setAppointment(response?.data.content)
        setAnimals(appointment.animals)
  
        setUpdate(true)
        // console.log(reports[0].appointment.id)
      } catch (error) {
        console.error('Error:', error)
        setSnackbarMessage('Appointment ' + error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }

    fetchAppointments()
  }, [update])

  //yeni report giriş formu işlemleri
  const handleNewReportInputChange = (e) => {
    const { name, value } = e.target
    setNewReport((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  //yeni report ekleme işlemi
  const handleAddNewReport = (e) => {
    e.preventDefault()
    axios
      .post(`${import.meta.env.VITE_APP_BASEURL}/api/v1/reports`, newReport)
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('Report Added')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
        setNewReport({
          title: '',
          diagnosis: '',
          price: '',
          appointmentId: '',
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Could Not: ' + error.response.data.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  const handleDeleteReport = (e) => {
    const id = e.target.id
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/reports/${id}`)
      .then(() => setUpdate(false))
      .then(() => {
        setSnackbarMessage('Report Deleted')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Report Could Not Deleted')
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  const handleUpdateReport = (e) => {
    e.preventDefault()

    const { id } = updateReport

    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/reports/${id}`,
        updateReport
      )
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('Report Updated')
        setSnackbarSeverity('success')
        setIsSnackbar(true)

        setUpdateReport({
          id: '',
          title: '',
          diagnosis: '',
          price: '',
          appointmentId: '',
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Report Could Not Updated')
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  const handleUpdateReportInputChange = (e) => {
    const { name, value } = e.target
    setUpdateReport((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateReportBtn = (e) => {
    setIsUpdate(true)
    const reportIndex = e.target.id
    const reportToUpdate = filteredReport[reportIndex]

    setSelectedReportId(reportToUpdate.id)
    setUpdateReport({
      ...reportToUpdate,
    })
  }

  const handleSearchQueryChange = (e) => {
    const query = e.target.value
    setIsOpen(true)
    setSearchQuery(query)
    setFilteredReport(
      reports.filter((report) =>
        report.title.toLowerCase().includes(query.toLowerCase())
      )
    )
  }

  return (
    <div className="container mx-auto p-4">
      {isSnackbar && (
        <Snackbar
          open={isSnackbar}
          autoHideDuration={2000}
          onClose={() => setIsSnackbar(false)}
        >
          <Alert
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      )}
      {/* güncelleme input form */}
      {isUpdate && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-bold mb-4">Report Update</h3>
          <form
            onSubmit={handleUpdateReport}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="col-span-1">
              <label htmlFor="report-id">Report ID:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="id"
                value={updateReport.id}
                placeholder="Report id"
                onChange={handleUpdateReportInputChange}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="title">Title:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="title"
                value={updateReport.title}
                placeholder="Title"
                onChange={handleUpdateReportInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="diagnosis">Diagnosis:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="diagnosis"
                value={updateReport.diagnosis}
                placeholder="Diagnosis"
                onChange={handleUpdateReportInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="price">Price:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="price"
                value={updateReport.price}
                placeholder="Price"
                onChange={handleUpdateReportInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="colour">Appointment:</label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                name="appointmentId"
                value={updateReport.appointmentId}
                onChange={handleUpdateReportInputChange}
              >
                <option value="">Select Appointment</option>
                {appointment?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id}-{'animal:' + a.animal.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3 text-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update Report
              </button>
            </div>
          </form>
        </div>
      )}
      {/* yeni report ekleme input form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-bold mb-4">Add Report</h3>
        <form
          onSubmit={handleAddNewReport}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="col-span-1">
            <label htmlFor="report-title">Title:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="title"
              value={newReport.title}
              placeholder="Title"
              onChange={handleNewReportInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="diagnosis">Diagnosis:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="diagnosis"
              value={newReport.diagnosis}
              placeholder="Diagnosis"
              onChange={handleNewReportInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="Price">Price:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="price"
              value={newReport.price}
              placeholder="Price"
              onChange={handleNewReportInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="appointment">Appointment:</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="appointmentId"
              value={newReport.appointmentId}
              onChange={handleNewReportInputChange}
            >
              <option value="">Select Appointment</option>
              {appointment.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id}-{'animal:' + a.animal.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-3 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Report
            </button>
          </div>
        </form>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          All Reports {isOpen ? 'Close' : 'Show'}
        </button>
      </div>
      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          type="text"
          placeholder="Search Reports"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </div>
      {isOpen && (
        <div>
          {filteredReport.length > 0 ? (
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">id</th>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Diagnosis</th>
                  <th className="py-2 px-4 border-b">Animal</th>
                  <th className="py-2 px-4 border-b">Doctor</th>
                  <th className="py-2 px-4 border-b">Price</th>
                  <th className="py-2 px-4 border-b">Appointment Id</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReport?.map((report, index) => {
                  const { id, title, diagnosis, price, appointment } = report
                  return (
                    <tr key={index} className="bg-gray-100">
                      <td className="py-2 px-4 border-b text-center">{id}</td>
                      <td className="py-2 px-4 border-b text-center">
                        {title}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {diagnosis}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {appointment.animalName}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {appointment.doctorName}
                        {console.log(appointment)}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {price}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {appointment.id}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          id={index}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                          onClick={handleUpdateReportBtn}
                        >
                          Update
                        </button>
                        <button
                          id={report.id}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={handleDeleteReport}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
           <Loading/>
          )}
        </div>
        // <h2 className="text-xl font-bold mb-4">Rapor Listesi</h2>
      )}
    </div>
  )
}
