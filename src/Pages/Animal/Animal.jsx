import axios from 'axios'
import { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Alert from '@mui/material/Alert'
import Loading from '../../Components/Loading/Loading'

export default function Animal() {

  const [isUpdate, setIsUpdate] = useState(false) // Güncelleme formu durumu

  const [animals, setAnimals] = useState([]) // Hayvan durumu
  const [filteredAnimals, setFilteredAnimals] = useState([]) // Filtrelenmiş hayvan durumu
  const [customers, setCustomers] = useState([])//?

  const [update, setUpdate] = useState(false) // Güncelleme durumu
  const [searchQuery, setSearchQuery] = useState('') //animal Arama sorgusu durumu

  const [searchCustomerQuery, setSearchCustomerQuery] = useState('') //customer arama sorgu durumu

  // Hayvan listeleme durumu
  const [isOpen, setIsOpen] = useState(false)

  //snackbar
  const [isSnackbar, setIsSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const [newAnimal, setNewAnimal] = useState({
    // Yeni hayvan durumu
    name: '',
    species: '',
    breed: '',
    gender: '',
    dateOfBirth: '',
    colour: '',
    customer: {
      id: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
    },
  })
  const [updateAnimal, setUpdateAnimal] = useState({
    // Güncellenecek hayvan durumu
    id: '',
    name: '',
    species: '',
    breed: '',
    gender: '',
    dateOfBirth: '',
    colour: '',
    customer: {
      id: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
    },
  })

  // Müşterileri getirme isteği??
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          
            `${import.meta.env.VITE_APP_BASEURL}/api/v1/customers?pageNumber=0&pageSize=10`
        )
        setCustomers(response.data.content)
      } catch (error) {
        console.error('Error:', error)
         setSnackbarMessage('customer'+error.message)
         setSnackbarSeverity('error')
         setIsSnackbar(true)
      }
    }

    fetchCustomers()
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
        setSnackbarMessage('animals '+error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }

    fetchAnimals()
  }, [update])

  // Yeni hayvan giriş formu işlemleri
  
  const handleNewAnimalInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'customer.id') {
      const selectedCustomer = customers.find(
        (customer) => customer.id === parseInt(value)
      )
      setNewAnimal((prev) => ({
        ...prev,
        customer: selectedCustomer || {
          id: '',
          name: '',
          phone: '',
          email: '',
          address: '',
          city: '',
        },
      }))
    } else {
      setNewAnimal((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Yeni hayvan ekleme işlemi
  const handleAddNewAnimal = (e) => {
    e.preventDefault()
    axios
      .post(`${import.meta.env.VITE_APP_BASEURL}/api/v1/animals`, newAnimal)
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('New Animal Added')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
        setNewAnimal({
          name: '',
          species: '',
          breed: '',
          gender: '',
          dateOfBirth: '',
          colour: '',
          customer: {
            id: '',
            name: '',
            phone: '',
            email: '',
            address: '',
            city: '',
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

  // Hayvanı silme işlemi
  const handleDeleteAnimal = (e) => {
    const id = e.target.id
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/animals/${id}`)
      .then(() => setUpdate(false))
      .then(() => {
        setSnackbarMessage('Animal Deleted')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Animal Could Not Deleted')
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Hayvan güncelleme işlemi
  const handleUpdateAnimal = (e) => {
    e.preventDefault()
    const { id } = updateAnimal
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/animals/${id}`,
        updateAnimal
      )
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('Animal Updated')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
        setUpdateAnimal({
          id: '',
          name: '',
          species: '',
          breed: '',
          gender: '',
          dateOfBirth: '',
          colour: '',
          customer: {
            id: '',
            name: '',
            phone: '',
            email: '',
            address: '',
            city: '',
          },
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Animal Could Not Updated')
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  // Güncelleme formundaki input değişiklikleri
  
  const handleUpdateAnimalInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'customer.id') {
      const selectedCustomer = customers.find(
        (customer) => customer.id === parseInt(value)
      )
      setUpdateAnimal((prev) => ({
        ...prev,
        customer: selectedCustomer || {
          id: '',
          name: '',
          phone: '',
          email: '',
          address: '',
          city: '',
        },
      }))
    } else {
      setUpdateAnimal((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }


  // Güncelleme butonuna tıklanınca
  const handleUpdateAnimalBtn = (e) => {
    setIsUpdate(true)
    const animalIndex = e.target.id
    const animalToUpdate = filteredAnimals[animalIndex]
    setUpdateAnimal({ ...animalToUpdate })
  }

  // Animal Arama sorgusu değişiklikleri
  const handleSearchQueryChange = (e) => {
    const query = e.target.value
    setIsOpen(true)
    setSearchQuery(query)
    setFilteredAnimals(
      animals.filter((animal) =>
        animal.name.toLowerCase().includes(query.toLowerCase())
      )
    )
  }

  // Müşteri ismine göre hayvan arama input
  const handleSearchCustomerQueryChange = (e) => {
    const query = e.target.value
    setIsOpen(true)
    setSearchCustomerQuery(query)
    setFilteredAnimals(
      animals.filter((animal) =>
        animal.customer.name.toLowerCase().includes(query.toLowerCase())
      )
    )
  }

  // Customer adına göre hayvan arama
  const searchAnimalsByName = (customerName) => {
    axios
      .get(
        `${
          import.meta.env.VITE_APP_BASEURL
        }/api/v1/animals/searchByCustomerName?name=${customerName}&pageNumber=0&pageSize=10`
      )
      .then((response) => {
        setFilteredAnimals(response.data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  // // Customer adına göre arama işlemi
  // const handleSearchByName = () => {
  //   if (searchCustomerQuery.trim() !== '') {
  //     searchAnimalsByName(searchCustomerQuery)
  //   } else {
  //     setFilteredAnimals(animals)
  //   }
  // }

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

      {/* güncelleme input formu */}
      {isUpdate && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-bold mb-4">Update Animal</h3>
          <form
            onSubmit={handleUpdateAnimal}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="col-span-1">
              <label htmlFor="name">Name:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="name"
                value={updateAnimal.name}
                placeholder="Name"
                onChange={handleUpdateAnimalInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="species">Species:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="species"
                value={updateAnimal.species}
                placeholder="Species"
                onChange={handleUpdateAnimalInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="breed">Breed:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="breed"
                value={updateAnimal.breed}
                placeholder="Breed"
                onChange={handleUpdateAnimalInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="gender">Gender:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="gender"
                value={updateAnimal.gender}
                placeholder="Gender"
                onChange={handleUpdateAnimalInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="dateOfBirth">Date of birth:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="date"
                name="dateOfBirth"
                value={updateAnimal.dateOfBirth}
                placeholder="Date of birth"
                onChange={handleUpdateAnimalInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="colour">Colour:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="colour"
                value={updateAnimal.colour}
                placeholder="Colour"
                onChange={handleUpdateAnimalInputChange}
              />
            </div>
            <div className="col-span-3">
              <label htmlFor="customer">Customer:</label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                name="customer.id"
                value={updateAnimal.customer.id}
                onChange={handleUpdateAnimalInputChange}
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.id} - {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3 text-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update Animal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* animal ekleme input form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-bold mb-4">Add Animal</h3>
        <form
          onSubmit={handleAddNewAnimal}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="col-span-1">
            <label htmlFor="name">Name:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="name"
              value={newAnimal.name}
              placeholder="Name"
              onChange={handleNewAnimalInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="species">Species:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="species"
              value={newAnimal.species}
              placeholder="Species"
              onChange={handleNewAnimalInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="breed">Breed:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="breed"
              value={newAnimal.breed}
              placeholder="Breed"
              onChange={handleNewAnimalInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="gender">Gender:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="gender"
              value={newAnimal.gender}
              placeholder="Gender"
              onChange={handleNewAnimalInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="dateOfBirth">Date of birth:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="date"
              name="dateOfBirth"
              value={newAnimal.dateOfBirth}
              placeholder="Date of Birth"
              onChange={handleNewAnimalInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="colour">Colour:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="colour"
              value={newAnimal.colour}
              placeholder="Colour"
              onChange={handleNewAnimalInputChange}
            />
          </div>
          <div className="col-span-3">
            <label htmlFor="customer">Customer:</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              name="customer.id"
              value={newAnimal.customer.id}
              onChange={handleNewAnimalInputChange}
            >
              <option value="">Select Customer</option>
              {customers?.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-3 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Animal
            </button>
          </div>
        </form>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          All Animal {isOpen ? 'Close' : 'Show'}
        </button>
      </div>

      {/* Hayvan ismine göre arama input */}
      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          type="text"
          value={searchQuery}
          placeholder="Search By Animal"
          onChange={handleSearchQueryChange}
        />
      </div>

      {/* Müşteri ismine göre hayvan arama input */}
      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          type="text"
          value={searchCustomerQuery}
          placeholder="Search By Customer "
          onChange={handleSearchCustomerQueryChange}
        />
      </div>
      {isOpen && (
        <div>
          {filteredAnimals.length > 0 ? (
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">id</th>
                  <th className="py-2 px-4 border-b">Animal Name</th>
                  <th className="py-2 px-4 border-b">Species</th>
                  <th className="py-2 px-4 border-b">Breed</th>
                  <th className="py-2 px-4 border-b">Gender</th>
                  <th className="py-2 px-4 border-b">DateOfBirth</th>
                  <th className="py-2 px-4 border-b">Colour</th>
                  <th className="py-2 px-4 border-b">Customer Name</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnimals?.map((animal, index) => {
                  const {
                    name,
                    species,
                    breed,
                    gender,
                    dateOfBirth,
                    colour,
                    customer,
                    id,
                  } = animal
                  return (
                    <tr key={index} className="bg-gray-100">
                      <td className="py-2 px-4 border-b text-center">{id}</td>
                      <td className="py-2 px-4 border-b text-center">{name}</td>
                      <td className="py-2 px-4 border-b text-center">
                        {species}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {breed}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {gender}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {dateOfBirth}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {colour}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {customer.name}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          id={id}
                          onClick={handleDeleteAnimal}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                        >
                          Delete
                        </button>
                        <button
                          id={index}
                          onClick={handleUpdateAnimalBtn}
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

