import axios from 'axios'
import { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import 'react-toastify/dist/ReactToastify.css'
import Loading from '../../Components/Loading/Loading'


export default function Doctor() {
  const [isUpdate, setIsUpdate] = useState(false) // Güncelleme butonu durumu

  const [doctor, setDoctor] = useState([]) // Doktor durumu
  const [filteredDoctors, setFilteredDoctors] = useState([]) // Filtrelenmiş doktor durumu
  const [update, setUpdate] = useState(false) // Güncelleme durumu
  const [searchQuery, setSearchQuery] = useState('') // Arama sorgusu durumu

  //Doktor listeleme durumu
  const [isOpen, setIsOpen] = useState(false)

  //snackbar
  const [isSnackbar, setIsSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const [newDoctor, setNewDoctor] = useState({
    // Yeni doktor durumu
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  })
  const [updateDoctor, setUpdateDoctor] = useState({
    // Güncellenecek doktor durumu
    id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  })

  // Backend'ten doktorları getirme isteği
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
         
            `${import.meta.env.VITE_APP_BASEURL}/api/v1/doctors?pageNumber=0&pageSize=10`
        )
        setDoctor(response.data.content)
        setFilteredDoctors(response.data.content)
        setUpdate(true)
      } catch (error) {
        console.error('Hata:', error)
         setSnackbarMessage('doctor ' + error.message)
         setSnackbarSeverity('error')
         setIsSnackbar(true)
      }
    }

    fetchDoctors()
  }, [update])

  // Yeni doktor giriş formu işlemleri
  const handleNewDoctorInputChange = (e) => {
    const { name, value } = e.target
    setNewDoctor((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Yeni doktor ekleme işlemi
  const handleAddNewDoctor = (e) => {
     e.preventDefault()
    axios
      .post(
        
          `${import.meta.env.VITE_APP_BASEURL}/api/v1/doctors`,
        newDoctor
      )
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('New Doctor Added')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
        setNewDoctor({
          name: '',
          phone: '',
          email: '',
          address: '',
          city: '',
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Could Not: ' + error.response.data.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Doktoru silme işlemi
  const handleDeleteDoctor = (e) => {
   
    const id = e.target.id
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/doctors/${id}`)
      .then(() => setUpdate(false))
      .then(() => {
        setSnackbarMessage('Doctor Deleted')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Doctor Could Not Deleted')
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Doktor güncelleme işlemi
  const handleUpdateDoctor = (e) => {
     e.preventDefault()
    const { id } = updateDoctor
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/doctors/${id}`,
        updateDoctor
      )
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('Doctor Updated')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
        setUpdateDoctor({
          id: '',
          name: '',
          phone: '',
          email: '',
          address: '',
          city: '',
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Doctor Could Not Updated')
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Güncelleme formundaki input değişiklikleri
  const handleUpdateDoctorInputChange = (e) => {
    const { name, value } = e.target
    setUpdateDoctor((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Güncelleme butonuna tıklanınca
  const handleUpdateDoctorBtn = (e) => {
    setIsUpdate(true)
    const doctorIndex = e.target.id
    const doctorToUpdate = filteredDoctors[doctorIndex]
    setUpdateDoctor({ ...doctorToUpdate })
  }

  // Arama sorgusu değişiklikleri
  const handleSearchQueryChange = (e) => {
    const query = e.target.value
    setIsOpen(true)
    setSearchQuery(query)
    setFilteredDoctors(
      doctor.filter((doc) =>
        doc.name.toLowerCase().includes(query.toLowerCase())
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
          <h3 className="text-xl font-bold mb-4">Update Doctor</h3>
          <form
            onSubmit={handleUpdateDoctor}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="col-span-1">
              <label htmlFor="name">Name:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="name"
                value={updateDoctor.name}
                placeholder="Name"
                onChange={handleUpdateDoctorInputChange}
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="phone">Phone:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="phone"
                value={updateDoctor.phone}
                placeholder="Phone"
                onChange={handleUpdateDoctorInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="email">Email:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="email"
                name="email"
                value={updateDoctor.email}
                placeholder="Email"
                onChange={handleUpdateDoctorInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="address">Address:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="address"
                value={updateDoctor.address}
                placeholder="Address"
                onChange={handleUpdateDoctorInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="city">City:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="city"
                value={updateDoctor.city}
                placeholder="City"
                onChange={handleUpdateDoctorInputChange}
              />
            </div>
            <div className="col-span-3">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update Doctor
              </button>
            </div>
          </form>
        </div>
      )}
      {/* yeni doctor ekleme input form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-bold mb-4">Add Doctor</h3>
        <form
          onSubmit={handleAddNewDoctor}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="col-span-1">
            <label htmlFor="name">Name:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="name"
              value={newDoctor.name}
              placeholder="Name"
              onChange={handleNewDoctorInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="phone">Phone:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="phone"
              value={newDoctor.phone}
              placeholder="Phone"
              onChange={handleNewDoctorInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="email">Email:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="email"
              name="email"
              value={newDoctor.email}
              placeholder="Email"
              onChange={handleNewDoctorInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="address">Address:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="address"
              value={newDoctor.address}
              placeholder="Address"
              onChange={handleNewDoctorInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="city">City:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="city"
              value={newDoctor.city}
              placeholder="City"
              onChange={handleNewDoctorInputChange}
            />
          </div>
          <div className="col-span-3 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Doctor
            </button>
          </div>
        </form>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          All Doctor {isOpen ? 'Close' : 'Show'}
        </button>
      </div>

      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          type="text"
          value={searchQuery}
          placeholder="Search Doctor"
          onChange={handleSearchQueryChange}
        />
      </div>

      {isOpen && (
        <div>
          {filteredDoctors.length > 0 ? (
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">id</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Adress</th>
                  <th className="py-2 px-4 border-b">City</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors?.map((doc, index) => {
                  const { name, phone, email, address, city, id } = doc
                  return (
                    <tr key={index} className="bg-gray-100">
                      <td className="py-2 px-4 border-b text-center">{id}</td>
                      <td className="py-2 px-4 border-b text-center">{name}</td>
                      <td className="py-2 px-4 border-b text-center">
                        {phone}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {email}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {address}
                      </td>
                      <td className="py-2 px-4 border-b text-center">{city}</td>

                      <td className="py-2 px-4 border-b text-center">
                        <button
                          id={id}
                          onClick={handleDeleteDoctor}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >
                          Delete
                        </button>
                        <button
                          id={index}
                          onClick={handleUpdateDoctorBtn}
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
