import axios from 'axios'
import { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Alert from '@mui/material/Alert'
import Loading from '../../Components/Loading/Loading'

export default function Customer() {
  const [isUpdate, setIsUpdate] = useState(false) // Güncelleme butonu durumu

  const [customer, setCustomer] = useState([]) // Müşteri durumu
  const [filteredCustomers, setFilteredCustomers] = useState([]) // Filtrelenmiş müşteri durumu
  const [update, setUpdate] = useState(false) // Güncelleme durumu
  const [searchQuery, setSearchQuery] = useState('') // Arama sorgusu durumu

  // Müşteri listeleme durumu
  const [isOpen, setIsOpen] = useState(false)

  //snackbar
  const [isSnackbar, setIsSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const [newCustomer, setNewCustomer] = useState({
    // Yeni müşteri durumu
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  })
  const [updateCustomer, setUpdateCustomer] = useState({
    // Güncellenecek müşteri durumu
    id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  })


  // Backend'ten müşterileri getirme isteği
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASEURL}/api/v1/customers?pageNumber=0&pageSize=10`
        )
        setCustomer(response.data.content)
        setFilteredCustomers(response.data.content)
        setUpdate(true)
      } catch (error) {
        console.error('Hata:', error)
        setSnackbarMessage('customer ' + error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }

    fetchCustomers()
  }, [update])

  // Yeni müşteri giriş formu işlemleri
  const handleNewCustomerInputChange = (e) => {
    const { name, value } = e.target
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Yeni müşteri ekleme işlemi
  const handleAddNewCustomer = (e) => {
    e.preventDefault()
    axios
      .post(import.meta.env.VITE_APP_BASEURL+'/api/v1/customers', newCustomer)
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('New Customer Added')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
        setNewCustomer({
          name: '',
          phone: '',
          email: '',
          address: '',
          city: '',
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Could not: ' + error.response.data.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Müşteriyi silme işlemi
  const handleDeleteCustomer = (e) => {
    const id = e.target.id
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/customers/${id}`)
      .then(() => setUpdate(false))
      .then(() => {
        setSnackbarMessage('Customer Deleted')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Customer Could Not Deleted')
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Müşteri güncelleme işlemi
  const handleUpdateCustomer = (e) => {
    e.preventDefault()
    const { id } = updateCustomer
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/customers/${id}`,
        updateCustomer
      )
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('Customer Updated')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
        setUpdateCustomer({
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
        setSnackbarMessage('Customer Could Not Updated')
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Güncelleme formundaki input değişiklikleri
  const handleUpdateCustomerInputChange = (e) => {
    const { name, value } = e.target
    setUpdateCustomer((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Güncelleme butonuna tıklanınca
  const handleUpdateCustomerBtn = (e) => {
    setIsUpdate(true)
    const customerIndex = e.target.id
    const customerToUpdate = filteredCustomers[customerIndex]
    setUpdateCustomer({ ...customerToUpdate })
  }

  // Arama sorgusu değişiklikleri
  const handleSearchQueryChange = (e) => {
    const query = e.target.value
    setIsOpen(true)
    setSearchQuery(query)
    setFilteredCustomers(
      customer.filter((cust) =>
        cust.name.toLowerCase().includes(query.toLowerCase())
      )
    )
  }
  // Customer adına göre arama istek gönderimi
  const searchCustomerByName = (customerName) => {
    axios
      .get(
        `${
          import.meta.env.VITE_APP_BASEURL
        }/api/v1/customers/searchByName?name=${customerName}&pageNumber=0&pageSize=10`
      )
      .then((response) => {
        setFilteredCustomers(response.data.content)
      })
      .catch((error) => {
        console.error('Error:', error)
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
      {isUpdate && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-bold mb-4">Update Customer</h3>
          <form
            onSubmit={handleUpdateCustomer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="col-span-1">
              <label htmlFor="name">Name:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="name"
                value={updateCustomer.name}
                placeholder="Name"
                onChange={handleUpdateCustomerInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="phone">Phone:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="phone"
                value={updateCustomer.phone}
                placeholder="Phone"
                onChange={handleUpdateCustomerInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="email">Email:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="email"
                name="email"
                value={updateCustomer.email}
                placeholder="Email"
                onChange={handleUpdateCustomerInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="address">Address:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="address"
                value={updateCustomer.address}
                placeholder="Address"
                onChange={handleUpdateCustomerInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="city">City:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="city"
                value={updateCustomer.city}
                placeholder="City"
                onChange={handleUpdateCustomerInputChange}
              />
            </div>
            <div className="col-span-3 text-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update Customer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customer ekleme input form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-bold mb-4">Add Customer</h3>
        <form
          onSubmit={handleAddNewCustomer}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="col-span-1">
            <label htmlFor="vane">Name:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="name"
              value={newCustomer.name}
              placeholder="Name"
              onChange={handleNewCustomerInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="phone">Phone:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="phone"
              value={newCustomer.phone}
              placeholder="Phone"
              onChange={handleNewCustomerInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="email">Email:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="email"
              name="email"
              value={newCustomer.email}
              placeholder="Email"
              onChange={handleNewCustomerInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="address">Address:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="address"
              value={newCustomer.address}
              placeholder="Address"
              onChange={handleNewCustomerInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="city">City:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="city"
              value={newCustomer.city}
              placeholder="City"
              onChange={handleNewCustomerInputChange}
            />
          </div>
          <div className="col-span-3 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Customer
            </button>
          </div>
        </form>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          All Customer {isOpen ? 'Close' : 'Show'}
        </button>
      </div>

      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          type="text"
          value={searchQuery}
          placeholder="Search Customer"
          onChange={handleSearchQueryChange}
        />
      </div>

      {isOpen && (
        <div>
          {filteredCustomers.length > 0 ? (
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
                {filteredCustomers?.map((cust, index) => {
                  const { name, phone, email, address, city, id } = cust
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
                          onClick={handleDeleteCustomer}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >
                          Delete
                        </button>
                        <button
                          id={index}
                          onClick={handleUpdateCustomerBtn}
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
