import axios from 'axios'
import { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-calendar/dist/Calendar.css'
import Alert from '@mui/material/Alert'

import Workday from '../Workday/Workday'
import Loading from '../../Components/Loading/Loading'

export default function Appointment() {
  const [isUpdate, setIsUpdate] = useState(false) // Güncelleme butonu durumu

  const [appointments, setAppointments] = useState([]) // Randevular
  const [customers, setCustomers] = useState([]) // Müşteriler
  const [doctors, setDoctors] = useState([]) // Doktorlar
  const [animals, setAnimals] = useState([]) // Hayvanlar
  const [filteredDoctors, setFilteredDoctors] = useState([]) // Filtrelenmiş doktorlar
  const [filteredCustomers, setFilteredCustomers] = useState([]) // Filtrelenmiş müşteriler

  const [update, setUpdate] = useState(false) // Güncelleme durumu

  // Randevu listeleme durumu
  const [isOpen, setIsOpen] = useState(false)

  //snackbar
  const [isSnackbar, setIsSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const [newAppointment, setNewAppointment] = useState({
    appointmentDate: '',
    doctor: {
      id: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
    },
    animal: {
      id: '',
      name: '',
      species: '',
      breed: '',
      gender: '',
      colour: '',
      dateOfBirth: '',
      customer: {
        id: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
      },
    },
  })
  const [updateAppointment, setUpdateAppointment] = useState({
    id: '',
    appointmentDate: '',
    doctor: {
      id: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
    },
    animal: {
      id: '',
      name: '',
      species: '',
      breed: '',
      gender: '',
      colour: '',
      dateOfBirth: '',
      customer: {
        id: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
      },
    },
  })

  // Müşteri hayvan ve doktorları getirme isteği
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASEURL}/api/v1/customers?pageNumber=0&pageSize=10`
        )
        setCustomers(response.data.content)
      } catch (error) {
        console.error('Error:', error)
        setSnackbarMessage('customer ' + error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          
            `${import.meta.env.VITE_APP_BASEURL}/api/v1/doctors?pageNumber=0&pageSize=10`
        )
        setDoctors(response.data.content)
        setFilteredDoctors(response.data.content)
      } catch (error) {
        console.error('Error:', error)
        setSnackbarMessage('doctor ' + error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }

    const fetchAnimals = async () => {
      try {
        const response = await axios.get(
         
            `${import.meta.env.VITE_APP_BASEURL}/api/v1/animals?pageNumber=0&pageSize=10`
        )
        setAnimals(response.data.content)
        setUpdate(true)
      } catch (error) {
        console.error('Error:', error)
        setSnackbarMessage('animal ' + error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }

    fetchCustomers()
    fetchDoctors()
    fetchAnimals()
  }, [update])

  // Backend'ten randevuları getirme isteği
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          
            `${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments?pageNumber=0&pageSize=10`
        )
        setAppointments(response.data.content)
        setUpdate(true)
      } catch (error) {
        console.error('Error:', error)
        setSnackbarMessage('appointment ' + error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }

    fetchAppointments()
  }, [update])

  // Yeni randevu giriş formu işlemleri
  const handleNewAppointmentInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'doctor.id') {
      setNewAppointment((prev) => ({
        ...prev,
        doctor: { id: value },
      }))
    } else if (name === 'animal.id') {
      const selectedAnimal = animals.find(
        (animal) => animal.id === parseInt(value)
      )
      const ownerId = selectedAnimal ? selectedAnimal.customer.id : ''
      setNewAppointment((prev) => ({
        ...prev,
        animal: { id: value, customer: { id: ownerId } },
      }))
      setFilteredCustomers(
        customers.filter((customer) => customer.id === ownerId)
      )
    } else {
      setNewAppointment((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleNewAppointmentDateChange = (date) => {
    setNewAppointment((prev) => ({
      ...prev,
      appointmentDate: date,
    }))
  }

  const handleAddNewAppointment = (e) => {
    e.preventDefault()
    axios
      .post(
        
          `${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments`,
        newAppointment
      )
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('New Appointment Added')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
        setNewAppointment({
          appointmentDate: '',
          doctor: {
            id: '',
            name: '',
            phone: '',
            email: '',
            address: '',
            city: '',
          },
          animal: {
            id: '',
            name: '',
            species: '',
            breed: '',
            gender: '',
            colour: '',
            dateOfBirth: '',
            customer: {
              id: '',
              name: '',
              phone: '',
              email: '',
              address: '',
              city: '',
            },
          },
        })
      })

      .catch((error) => {
        console.error('Error:', error?.response.data.message)
        setSnackbarMessage(error?.response.data.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Randevuyu silme işlemi
  const handleDeleteAppointment = (e) => {
    const id = e.target.id
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments/${id}`)
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('Appointment Deleted')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
      })

      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Appointment Could Not Deleted')
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Randevu güncelleme işlemi
  const handleUpdateAppointment = (e) => {
    e.preventDefault()
    const { id } = updateAppointment
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments/${id}`,
        updateAppointment
      )
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('Appointment Updated')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
        setUpdateAppointment({
          id: '',
          appointmentDate: new Date(),
          doctor: {
            id: '',
            name: '',
            phone: '',
            email: '',
            address: '',
            city: '',
          },
          animal: {
            id: '',
            name: '',
            species: '',
            breed: '',
            gender: '',
            colour: '',
            dateOfBirth: '',
            customer: {
              id: '',
              name: '',
              phone: '',
              email: '',
              address: '',
              city: '',
            },
          },
        })
      })

      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage(error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Güncelleme formundaki input değişiklikleri
  const handleUpdateAppointmentInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'doctor.id') {
      setUpdateAppointment((prev) => ({
        ...prev,
        doctor: { id: value },
      }))
    } else if (name === 'animal.id') {
      const selectedAnimal = animals.find(
        (animal) => animal.id === parseInt(value)
      )
      const ownerId = selectedAnimal ? selectedAnimal.customer.id : ''
      setUpdateAppointment((prev) => ({
        ...prev,
        animal: { id: value, customer: { id: ownerId } },
      }))
      // Filter customers to show only the owner of the selected animal
      setFilteredCustomers(
        customers.filter((customer) => customer.id === ownerId)
      )
    } else {
      setUpdateAppointment((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleUpdateAppointmentDateChange = (date) => {
    const timezoneOffset = date.getTimezoneOffset() * 60000 // getTimezoneOffset() returns the difference in minutes, so convert to milliseconds
    const correctedDate = new Date(date.getTime() - timezoneOffset)
    const formattedDate =
      correctedDate.toISOString().split(':').slice(0, 2).join(':') + ':00'
    setUpdateAppointment((prev) => ({
      ...prev,
      appointmentDate: formattedDate,
    }))
    // Filter doctors based on selected date
    filterDoctorsByDate(formattedDate)
  }

  // Güncelleme butonuna tıklanınca
  const handleUpdateAppointmentBtn = (e) => {
    setIsUpdate(true)
    const appointmentIndex = e.target.id
    const appointmentToUpdate = appointments[appointmentIndex]
    setUpdateAppointment({ ...appointmentToUpdate })
  }

  // Filter doctors by selected date
  const filterDoctorsByDate = (date) => {
    const dayOfWeek = new Date(date).getDay() // Get the day of the week
    const availableDoctors = doctors.filter((doctor) => {
      return doctor.workdays && doctor.workdays.includes(dayOfWeek)
    })
    setFilteredDoctors(availableDoctors)
  }

  const [doctorSearchParams, setDoctorSearchParams] = useState({
    doctorId: '',
    startDate: null,
    endDate: null,
  })
  const [animalSearchParams, setAnimalSearchParams] = useState({
    animalId: '',
    startDate: null,
    endDate: null,
  })

  const [doctorSearchResults, setDoctorSearchResults] = useState([])
  const [animalSearchResults, setAnimalSearchResults] = useState([])

  const handleDoctorSearchParamsChange = (e) => {
    const { name, value } = e.target
    setDoctorSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const handleAnimalSearchParamsChange = (e) => {
    const { name, value } = e.target
    setAnimalSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDoctorDateChange = (date, field) => {
    setDoctorSearchParams((prev) => ({
      ...prev,
      [field]: date,
    }))
  }
  const handleAnimalDateChange = (date, field) => {
    setAnimalSearchParams((prev) => ({
      ...prev,
      [field]: date,
    }))
  }

  const handleDoctorSearch = (e) => {
    e.preventDefault()
    const { doctorId, startDate, endDate } = doctorSearchParams
    axios
      .get(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments/searchByDoctorAndDateRange`,
        {
          params: {
            id: doctorId,
            startDate: startDate.toISOString().split('T')[0], // Format date as 'yyyy-MM-dd'
            endDate: endDate.toISOString().split('T')[0], // Format date as 'yyyy-MM-dd'
            pageNumber: 0,
            pageSize: 10,
          },
        }
      )
      .then((response) => {
        setDoctorSearchResults(response.data.content)
        // setIsSnackbar(true)
        setSnackbarMessage('Appointments found.')
        setSnackbarSeverity('success')
      })
      .catch((error) => {
        console.error('Error:', error)
        setIsSnackbar(true)
        setSnackbarMessage('Error fetching appointments.')
        setSnackbarSeverity('error')
      })
  }

 
  const handleAnimalSearch = (e) => {
    e.preventDefault()
    const { animalId, startDate, endDate } = animalSearchParams
  
    axios
      .get(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments/searchByAnimalAndDateRange`,
        {
          params: {
            id: animalId,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            pageNumber: 0,
            pageSize: 10,
          },
        }
      )
      .then((response) => {
        setAnimalSearchResults(response.data.content)
        // setIsSnackbar(true)
        setSnackbarMessage('Animal appointments found.')
        setSnackbarSeverity('success')
      })
      .catch((error) => {
        console.error('Error:', error)
        setIsSnackbar(true)
        setSnackbarMessage('Error fetching animal appointments.')
        setSnackbarSeverity('error')
      })
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
      {/* Appointment */}
      {isUpdate && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-bold mb-4">Update Appointment</h3>
          <form
            onSubmit={handleUpdateAppointment}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="flex flex-col col-span-1">
              <label htmlFor="appointmentDate" className="mb-2">
                Date:
              </label>
              <DatePicker
                selected={new Date(updateAppointment.appointmentDate)}
                onChange={handleUpdateAppointmentDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={60}
                timeCaption="Time"
                dateFormat="yyyy-MM-dd HH:mm"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-72"
              />
            </div>

            <div className="flex flex-col col-span-1">
              <label htmlFor="doctor" className="mb-2">
                Doctor:
              </label>
              <select
                className="shadow appearance-none w-full border rounded py-2 px-3 text-gray-700"
                name="doctor.id"
                value={updateAppointment.doctor.id}
                onChange={handleUpdateAppointmentInputChange}
              >
                <option value="">Select Doctor</option>
                {doctors?.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col col-span-1">
              <label htmlFor="animal" className="mb-2">
                Animal:
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                name="animal.id"
                value={updateAppointment.animal.id}
                onChange={handleUpdateAppointmentInputChange}
              >
                <option value="">Select Animal</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col col-span-1 justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-auto"
              >
                Update Appointment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Randevu ekleme formu */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-bold mb-4">Add Appointment</h3>
        <form
          onSubmit={handleAddNewAppointment}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="col-span-1 flex flex-col">
            <label htmlFor="">Date: </label>
            <DatePicker
              selected={newAppointment.appointmentDate}
              onChange={handleNewAppointmentDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={60}
              timeCaption="Time"
              dateFormat="yyyy-MM-dd HH:mm"
              className="shadow appearance-none border rounded py-2 px-2 w-full text-gray-700"
            />
          </div>
          <div className="col-span-1 flex flex-col">
            <label htmlFor="">Doctor:</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 mb-3"
              name="doctor.id"
              value={newAppointment.doctor.id}
              onChange={handleNewAppointmentInputChange}
            >
              <option value="">Select Doctor</option>
              {filteredDoctors?.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1 flex flex-col">
            <label htmlFor="">Animal:</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              name="animal.id"
              value={newAppointment.animal.id}
              onChange={handleNewAppointmentInputChange}
            >
              <option value="">Select Animal</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1 flex flex-col">
            <label htmlFor="">Customer:</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              name="customer.id"
              value={newAppointment.animal.customer.id}
              onChange={handleNewAppointmentInputChange}
            >
              <option value="">Select Customer</option>
              {filteredCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-3 text-center ">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Appointment
            </button>
          </div>
        </form>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          All Appointment {isOpen ? 'Close' : 'Show'}
        </button>
      </div>

      {/* Randevu listesi */}
      <div>
        {isOpen && (
          <div>
            {appointments.length > 0 ? (
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">id</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Doctor</th>
                    <th className="py-2 px-4 border-b">Animal & ID</th>
                    <th className="py-2 px-4 border-b">Customer & ID</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments?.map((appointment, index) => {
                    const { id, appointmentDate, doctor, animal } = appointment
                    return (
                      <tr key={index} className="bg-gray-100">
                        <td className="py-2 px-4 border-b text-center">{id}</td>
                        <td className="py-2 px-4 border-b text-center">
                          {appointmentDate}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {doctor.name}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {animal.id}-{animal.name}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          {animal.customer.id}-{animal.customer.name}
                        </td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            id={appointment.id}
                            onClick={handleDeleteAppointment}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Delete
                          </button>
                          <button
                            id={index}
                            onClick={handleUpdateAppointmentBtn}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
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

      {/* Search by Doctor and Date Range */}

      <div className="mt-10">
        <form
          onSubmit={handleDoctorSearch}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="flex flex-col col-span-1">
            <label htmlFor="doctor" className="mb-2">
              Doctor:{' '}
            </label>
            <select
              name="doctorId"
              value={doctorSearchParams.doctorId}
              onChange={handleDoctorSearchParamsChange}
              className="shadow appearance-none w-full border rounded py-2 px-3 text-gray-700"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.id}-{doctor.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col col-span-1">
            <label htmlFor="start-date" className="mb-2">
              Start Date:{' '}
            </label>
            <DatePicker
              selected={doctorSearchParams.startDate}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full"
              onChange={(date) => handleDoctorDateChange(date, 'startDate')}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="flex flex-col col-span-1">
            {' '}
            <label htmlFor="end-date" className="mb-2">
              End Date:
            </label>
            <DatePicker
              selected={doctorSearchParams.endDate}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full"
              onChange={(date) => handleDoctorDateChange(date, 'endDate')}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="flex flex-col justify-center mt-8 ">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          </div>
        </form>
        <div className="min-w-full bg-white rounded-lg shadow-md mt-5">
          {doctorSearchResults.length > 0 ? (
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Doctor</th>
                  <th className="py-2 px-4 border-b">Animal</th>
                  <th className="py-2 px-4 border-b">Appointment Date</th>
                </tr>
              </thead>
              <tbody>
                {doctorSearchResults.map((appointment) => (
                  <tr key={appointment.id} className="bg-gray-100">
                    <td className="py-2 px-4 border-b text-center">
                      {appointment.doctor.name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {appointment.animal.name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {appointment.appointmentDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="py-4 text-center text-gray-600">
              No appointments found.
            </p>
          )}
        </div>
      </div>

      {/* animal search */}
      <div className="mt-10">
        <form
          onSubmit={handleAnimalSearch}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="flex flex-col col-span-1">
            <label htmlFor="animal" className="mb-2">
              Animal:{' '}
            </label>
            <select
              name="animalId"
              value={animalSearchParams.animalId}
              onChange={handleAnimalSearchParamsChange}
              className="shadow appearance-none w-full border rounded py-2 px-3 text-gray-700"
            >
              <option value="">Select Animal</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.id}-{animal.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col col-span-1">
            <label htmlFor="start-date" className="mb-2">
              Start Date:{' '}
            </label>
            <DatePicker
              selected={animalSearchParams.startDate}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full"
              onChange={(date) => handleAnimalDateChange(date, 'startDate')}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="flex flex-col col-span-1">
            <label htmlFor="end-date" className="mb-2">
              End Date:{' '}
            </label>
            <DatePicker
              selected={animalSearchParams.endDate}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full"
              onChange={(date) => handleAnimalDateChange(date, 'endDate')}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="flex flex-col justify-center mt-8 ">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          </div>
        </form>
        <div className="min-w-full bg-white rounded-lg shadow-md mt-5">
          {animalSearchResults.length > 0 ? (
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Animal</th>
                  <th className="py-2 px-4 border-b">Doctor</th>
                  <th className="py-2 px-4 border-b">Appointment Date</th>
                </tr>
              </thead>
              <tbody>
                {animalSearchResults.map((appointment) => (
                  <tr key={appointment.id} className="bg-gray-100">
                    <td className="py-2 px-4 border-b text-center">
                      {appointment.animal.name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {appointment.doctor.name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {appointment.appointmentDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="py-4 text-center text-gray-600">
              No appointments found.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
