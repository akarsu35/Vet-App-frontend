import axios from 'axios'
import { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import 'react-toastify/dist/ReactToastify.css'
import Loading from '../../Components/Loading/Loading'

export default function Workday() {
  const [isUpdate, setIsUpdate] = useState(false) // Update button state
  const [selectedWorkdayId, setSelectedWorkdayId] = useState(null)
  const [doctors, setDoctors] = useState([]) //doctor state
  const [filteredDoctors, setFilteredDoctors] = useState([]) //filtrelenmiş doctor State

  const [workdays, setWorkdays] = useState([]) // Workdays state
  const [filteredWorkdays, setFilteredWorkdays] = useState([]) // Filtered workdays state
  const [update, setUpdate] = useState(false) // Update state
  const [searchQuery, setSearchQuery] = useState('') // Search query state

  // Workday listing state
  const [isOpen, setIsOpen] = useState(false)

  //snackbar
  const [isSnackbar, setIsSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const [newWorkday, setNewWorkday] = useState({
    // New workday state
    workDate: '',
    doctorId: '',
  })
  const [updateWorkday, setUpdateWorkday] = useState({
    // Update workday state
    id: '',
    workDate: '',
    doctorId:''
  })
  
  //doctor backend sorgu
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          
            `${import.meta.env.VITE_APP_BASEURL}/api/v1/doctors?pageNumber=0&pageSize=10`
        )
        setDoctors(response.data.content)
        setFilteredDoctors(response.data.content)
        setUpdate(true)
      } catch (error) {
        console.error('Error:', error)
        setSnackbarMessage('Doctor '+error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }

    fetchDoctors()
  }, [])

  // Fetch workdays from the backend
  useEffect(() => {
    const fetchWorkdays = async () => {
      try {
        const response = await axios.get(
          
           `${import.meta.env.VITE_APP_BASEURL}/api/v1/available-dates?pageNumber=0&pageSize=10`
        )
        setWorkdays(response.data.content)
        setFilteredWorkdays(response.data.content)
        setUpdate(true)
      } catch (error) {
        console.error('Error:', error)
        setSnackbarMessage('Available-dates '+error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }

    fetchWorkdays()
  }, [update])

  // Handle new workday input changes
  const handleNewWorkdayInputChange = (e) => {
    const { name, value } = e.target
    setNewWorkday((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Add new workday
  const handleAddNewWorkday = (e) => {
    e.preventDefault()
    axios
      .post(`${import.meta.env.VITE_APP_BASEURL}/api/v1/available-dates`, {
        workDate: newWorkday.workDate,
        doctorId: newWorkday.doctorId,
      })
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('Workday added successfully')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
        setNewWorkday({
          workDate: '',
          doctorId: '',
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage(error.response.data.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Delete workday
  const handleDeleteWorkday = (e) => {
    const id = e.target.id
    axios
      .delete(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/available-dates/${id}`
      )
      .then(() => setUpdate(false))
      .then(() => {
        setSnackbarMessage('Workday deleted successfully')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Failed to delete workday')
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Update workday
  const handleUpdateWorkday = (e) => {
    e.preventDefault()
    
    const { id, workDate, doctorId } = updateWorkday
    console.log(doctorId)
    axios
      .put(`${import.meta.env.VITE_APP_BASEURL}/api/v1/available-dates/${id}`, {
        id,
        workDate,
        doctorId,
      })

      .then(() => {
        setUpdate(false)
        setSnackbarMessage('Workday updated successfully')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
        setUpdateWorkday({
          workDate: '',
          doctorId: '',
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage(error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Handle update form input changes
  const handleUpdateWorkdayInputChange = (e) => {
    const { name, value } = e.target
    setUpdateWorkday((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Update button click
  const handleUpdateWorkdayBtn = (e) => {
    setIsUpdate(true)
    const workdayIndex = e.target.id
    const workdayToUpdate = filteredWorkdays[workdayIndex]
    setSelectedWorkdayId(workdayToUpdate.id)
    setUpdateWorkday({
      workDate: workdayToUpdate.workDay ? workdayToUpdate.workDay : '',
      doctorId: workdayToUpdate.doctor.id,
    })
    console.log(workdayToUpdate.doctor.id)
  }

  // Search query changes
  const handleSearchQueryChange = (e) => {
    const query = e.target.value
    setIsOpen(true)
    setSearchQuery(query)
    setFilteredWorkdays(
      workdays.filter((workday) =>
        workday.doctor.name.toLowerCase().includes(query.toLowerCase())
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

      {isUpdate && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-bold mb-4">Update Workday</h3>
          <form onSubmit={handleUpdateWorkday}>
            <label htmlFor="workday">WorkDate:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="date"
              name="workDate"
              value={updateWorkday.workDate}
              placeholder="Work Date"
              onChange={handleUpdateWorkdayInputChange}
            />
            <div className="mb-3">
              <label className="block text-gray-700">Doctor Name:</label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                name="doctorId"
                value={updateWorkday.doctorId}
                onChange={handleUpdateWorkdayInputChange}
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id}-{d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3 text-center ">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update Workday
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-bold mb-4">Add Workday</h3>
        <form onSubmit={handleAddNewWorkday}>
          <label htmlFor="workday">WorkDate:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
            type="date"
            name="workDate"
            value={newWorkday.workDate}
            placeholder="Work Date"
            onChange={handleNewWorkdayInputChange}
          />
          <div className="mb-3">
            <label className="block text-gray-700">Doctor Name:</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="doctorId"
              value={newWorkday.doctorId}
              onChange={handleNewWorkdayInputChange}
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id}-{d.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Workday
          </button>
        </form>
        <div className="col-span-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
          >
            All Workdays {isOpen ? 'Close' : 'Show'}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          type="text"
          value={searchQuery}
          placeholder="Search Doctor Workday "
          onChange={handleSearchQueryChange}
        />
      </div>

      {isOpen && (
        <div>
          {filteredWorkdays.length > 0 ? (
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">id</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Doctor</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkdays?.map((workday, index) => {
                  const { id, workDay, doctor } = workday
                  return (
                    <tr key={id} className="bg-gray-100">
                      <td className="py-2 px-4 border-b text-center">{id}</td>
                      <td className="py-2 px-4 border-b text-center">
                        {workDay}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {doctor.name}-{doctor.id}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          id={id}
                          onClick={handleDeleteWorkday}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >
                          Delete
                        </button>
                        <button
                          id={index}
                          onClick={handleUpdateWorkdayBtn}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                        >
                          Update
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
      )}
    </div>
  )
}
