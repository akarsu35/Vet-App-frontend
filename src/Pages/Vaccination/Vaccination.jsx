import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Loading from '../../Components/Loading/Loading'

export default function VaccinationSearch() {
  const [isUpdate, setIsUpdate] = useState(false)
  const [vaccinations, setVaccinations] = useState([])
  const [filteredVaccinations, setFilteredVaccinations] = useState([])
  const [update, setUpdate] = useState(false)
  const [searchQuery, setSearchQuery] = useState('') //vaccation ismine göre aram state
  const [searchAnimalQuery, setSearchAnimalQuery] = useState('') //hayvan ismine göre arama state

  const [isSnackbar, setIsSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [selectedVaccinationId, setSelectedVaccinationId] = useState('')
  const [animals, setAnimals] = useState([])
  const [animalWithoutCustomer, setAnimalWithoutCustomer] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAnimal, setSelectedAnimal] = useState([])

  //tarih aralığına göre vaccation arama state
  const [vaccinationSearchParams, setVaccinationSearchParams] = useState({
    startDate: null,
    endDate: null,
  })

  const handleVaccinationDateChange = (date, field) => {
    setVaccinationSearchParams((prevState) => ({
      ...prevState,
      [field]: date,
    }))
  }

  //?
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get(
          
            `${import.meta.env.VITE_APP_BASEURL}/api/v1/animals?pageNumber=0&pageSize=10`
        )
        setAnimals(response?.data.content)
        setAnimalWithoutCustomer(
          response?.data.content.filter((animal) => animal.customer === null)
        )
        setFilteredVaccinations(response?.data.content)
        setUpdate(true)
      } catch (error) {
        console.error('Error:', error)
        setSnackbarMessage('Animal ' + error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }

    fetchAnimals()
  }, [])

  const [newVaccination, setNewVaccination] = useState({
    name: '',
    code: '',
    protectionStartDate: '',
    protectionFinishDate: '',
    animalWithoutCustomer: {
      id: '',
      name: '',
      species: '',
      breed: '',
      gender: '',
      dateOfBirth: '',
      colour: '',
    },
  })

  const [updateVaccination, setUpdateVaccination] = useState({
    id: '',
    name: '',
    code: '',
    protectionStartDate: '',
    protectionFinishDate: '',
    animalWithoutCustomer: {
      id: '',
      name: '',
      species: '',
      breed: '',
      gender: '',
      dateOfBirth: '',
      colour: '',
    },
  })

  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        const response = await axios.get(
          
           `${import.meta.env.VITE_APP_BASEURL}/api/v1/vaccinations?pageNumber=0&pageSize=10`
        )
        setVaccinations(response?.data.content)
        setFilteredVaccinations(response?.data.content)
        setUpdate(true)
      } catch (error) {
        console.error('Error:', error)
        setSnackbarMessage('Vaccination ' + error.message)
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      }
    }
    fetchVaccinations()
  }, [update])

  //?
  const handleNewVaccinationInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'animalWithoutCustomer.id') {
      const selectedAnimal = animals.find(
        (animal) => animal.id === parseInt(value)
      )
      setNewVaccination((prev) => ({
        ...prev,
        animalWithoutCustomer: selectedAnimal || {
          id: '',
          name: '',
          species: '',
          breed: '',
          gender: '',
          dateOfBirth: '',
          colour: '',
        },
      }))
    } else {
      setNewVaccination((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddNewVaccination = (e) => {
    e.preventDefault()

    axios
      .post(
        
          `${import.meta.env.VITE_APP_BASEURL}/api/v1/vaccinations`,
        newVaccination
      )
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('Vaccination added successfully')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
        setNewVaccination({
          name: '',
          code: '',
          protectionStartDate: '',
          protectionFinishDate: '',
          animalWithoutCustomer: {
            id: '',
            name: '',
            species: '',
            breed: '',
            gender: '',
            dateOfBirth: '',
            colour: '',
          },
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Failed to add vaccination')
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  const handleDeleteVaccination = (e) => {
    const id = e.target.id
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/vaccinations/${id}`)
      .then(() => setUpdate(false))
      .then(() => {
        setSnackbarMessage('Vaccination deleted successfully')
        setSnackbarSeverity('success')
        setIsSnackbar(true)
      })
      .catch((error) => {
        console.error('Error:', error)
        setSnackbarMessage('Failed to delete vaccination')
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  const handleUpdateVaccination = (e) => {
    e.preventDefault()

    const { id } = updateVaccination
    console.log('Update vaccination payload:', updateVaccination)

    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/vaccinations/${id}`,
        updateVaccination
      )
      .then(() => {
        setUpdate(false)
        setSnackbarMessage('Vaccination updated successfully')
        setSnackbarSeverity('success')
        setIsSnackbar(true)

        setUpdateVaccination({
          id: '',
          name: '',
          code: '',
          protectionStartDate: '',
          protectionFinishDate: '',
          animalWithoutCustomer: {
            id: '',
          },
        })
      })
      .catch((error) => {
        console.error('Error:', error.response || error.message || error)
        setSnackbarMessage(
          'Vaccination ' + (error.response?.data?.message || error.message)
        )
        setSnackbarSeverity('error')
        setIsSnackbar(true)
      })
  }

  //?
  const handleUpdateVaccinationInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'animalWithoutCustomer.id') {
      const selectedAnimal = animals.find(
        (animal) => animal.id === parseInt(value)
      )
      if (selectedAnimal) {
        console.log('Selected animal:', selectedAnimal)
        setUpdateVaccination((prev) => ({
          ...prev,
          animalWithoutCustomer: {
            id: selectedAnimal.id,
            name: selectedAnimal.name,
            species: selectedAnimal.species,
            breed: selectedAnimal.breed,
            gender: selectedAnimal.gender,
            dateOfBirth: selectedAnimal.dateOfBirth,
            colour: selectedAnimal.colour,
          },
        }))
        setAnimalWithoutCustomer({
          id: selectedAnimal.id,
          name: selectedAnimal.name,
          species: selectedAnimal.species,
          breed: selectedAnimal.breed,
          gender: selectedAnimal.gender,
          dateOfBirth: selectedAnimal.dateOfBirth,
          colour: selectedAnimal.colour,
        })
      }
    } else {
      setUpdateVaccination((prev) => ({ ...prev, [name]: value }))
    }
    console.log('Updated vaccination:', updateVaccination)
  }

  const handleUpdateVaccinationBtn = (e) => {
    setIsUpdate(true)
    const vaccinationIndex = e.target.id
    const vaccinationToUpdate = filteredVaccinations[vaccinationIndex]

    setSelectedVaccinationId(vaccinationToUpdate.id)
    setUpdateVaccination({
      ...vaccinationToUpdate,
    })
    console.log('vaccinationupdate:', vaccinationToUpdate)
  }

  //vaccination isme göre arama
  const handleSearchQueryChange = (e) => {
    const query = e.target.value
    setIsOpen(true)
    setSearchQuery(query)
    setFilteredVaccinations(
      vaccinations.filter((vaccination) =>
        vaccination.name.toLowerCase().includes(query.toLowerCase())
      )
    )
  }


  const [isDateOpen,setIsDateOpen]=useState(false)//date range loading component state
  const [vaccinationSearchResults, setVaccinationSearchResults] = useState([]) //vaccination tarih aralığına göre search state
  //vaccination animal ismine göre arama butonu
  const handleSearch = (e) => {
    e.preventDefault()
    const { startDate, endDate } = vaccinationSearchParams

    setIsDateOpen(true)
    axios
      .get(
        `${
          import.meta.env.VITE_APP_BASEURL
        }/api/v1/vaccinations/searchByVaccinationRange`,
        {
          params: {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            pageNumber: 0,
            pageSize: 10,
          },
        }
      )
      .then((response) => {
        setVaccinationSearchResults(response.data.content)
        console.log(response)
        // setIsSnackbar(true)
        setSnackbarMessage('Vaccination found.')
        setSnackbarSeverity('success')
      })
      .catch((error) => {
        console.error('Error:', error)
        setIsSnackbar(true)
        setSnackbarMessage('Error fetching vaccination.')
        setSnackbarSeverity('error')
      })
  }
  //vaccination hayvan ismine göre arama
  const handleAnimalSearchQueryChange = (e) => {
    const query = e.target.value
    setIsOpen(true)
    setSearchAnimalQuery(query)
    setFilteredVaccinations(
      vaccinations.filter((vaccination) =>
        vaccination.animal.name.toLowerCase().includes(query.toLowerCase())
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
        // aşı güncelleme
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-xl font-bold mb-4">Update Vaccination</h3>
          <form
            onSubmit={handleUpdateVaccination}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="col-span-1">
              <label htmlFor="vaccation-name">Vaccination Name:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="name"
                value={updateVaccination.name}
                placeholder="Vaccination Name"
                onChange={handleUpdateVaccinationInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="vaccation-code">Vaccination Code:</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="text"
                name="code"
                value={updateVaccination.code}
                placeholder="Code"
                onChange={handleUpdateVaccinationInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="protection-startdate">
                Protection StartDate:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="date"
                name="protectionStartDate"
                value={updateVaccination.protectionStartDate}
                placeholder="Protection Start Date"
                onChange={handleUpdateVaccinationInputChange}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="protection-finishdate">
                Protection FinishDate:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
                type="date"
                name="protectionFinishDate"
                value={updateVaccination.protectionFinishDate}
                placeholder="Protection Finish Date"
                onChange={handleUpdateVaccinationInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="animal">Animal:</label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                name="animalWithoutCustomer.id"
                value={updateVaccination.animal.id}
                onChange={handleUpdateVaccinationInputChange}
              >
                <option value="">Select Animal</option>
                {animals.map((animal) => (
                  <option key={animal.id} value={animal.id}>
                    {animal.id} -{animal.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-3 text-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* yeni Aşı ekleme */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-bold mb-4">Add New Vaccination</h3>
        <form
          onSubmit={handleAddNewVaccination}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="col-span-1">
            <label htmlFor="vaccation-name">Vaccination Name:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="name"
              value={newVaccination.name}
              placeholder="Vaccination Name"
              onChange={handleNewVaccinationInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="vaccation-name">Vaccination Code:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              name="code"
              value={newVaccination.code}
              placeholder="Code"
              onChange={handleNewVaccinationInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="protection-startdate">Protection StartDate:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="date"
              name="protectionStartDate"
              value={newVaccination.protectionStartDate}
              placeholder="Protection Start Date"
              onChange={handleNewVaccinationInputChange}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="protection-finishdate">
              Protection FinishDate:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="date"
              name="protectionFinishDate"
              value={newVaccination.protectionFinishDate}
              placeholder="Protection Finish Date"
              onChange={handleNewVaccinationInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="vaccation-name">Animal:</label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="animalWithoutCustomer.id"
              value={newVaccination.animalWithoutCustomer.id}
              onChange={handleNewVaccinationInputChange}
            >
              <option value="">Select Animal</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.id}-{animal.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-3 text-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Add Vaccination
            </button>
          </div>
        </form>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          All Vaccinations {isOpen ? 'Close' : 'Show'}
        </button>
      </div>

      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          type="text"
          placeholder="Search Vaccinations"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
      </div>
      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          type="text"
          placeholder="Search Vaccinations By Animal"
          value={searchAnimalQuery}
          onChange={handleAnimalSearchQueryChange}
        />
      </div>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4"
      >
        <div className="flex flex-col col-span-1">
          <label htmlFor="start-date" className="mb-2">
            Start Date:{' '}
          </label>
          <DatePicker
            selected={vaccinationSearchParams.startDate}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full"
            onChange={(date) => handleVaccinationDateChange(date, 'startDate')}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div className="flex flex-col col-span-1">
          <label htmlFor="end-date" className="mb-2">
            End Date:
          </label>
          <DatePicker
            selected={vaccinationSearchParams.endDate}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full"
            onChange={(date) => handleVaccinationDateChange(date, 'endDate')}
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

      {/* vaccination daterange  */}
      {isDateOpen && (
        <div>
          <label htmlFor="">Date Range Search Results</label>
          <div className="min-w-full bg-white rounded-lg shadow-md my-5 ">
            {vaccinationSearchResults.length > 0 ? (
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">id</th>
                    <th className="py-2 px-4 border-b">Code</th>
                    <th className="py-2 px-4 border-b">protectionStartDate</th>
                    <th className="py-2 px-4 border-b">protectionEndDate</th>
                    <th className="py-2 px-4 border-b">animalId</th>
                    <th className="py-2 px-4 border-b">Animal Name</th>
                    <th className="py-2 px-4 border-b">Customer Name</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccinationSearchResults?.map((vaccination, index) => {
                    return (
                      <tr key={vaccination.id} className="bg-gray-100">
                        <td className="py-2 px-4 border-b text-center">
                          {vaccination.id}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          {vaccination.code}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          {vaccination.protectionStartDate}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          {vaccination.protectionFinishDate}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          {vaccination.animal.id}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          {vaccination.animal.name}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          {vaccination.animal.customer.name}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          <button
                            id={index}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={handleUpdateVaccinationBtn}
                          >
                            Update
                          </button>
                          <button
                            id={vaccination.id}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleDeleteVaccination}
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
              <Loading />
              // <p className="py-4 text-center text-gray-600">
              //   No appointments found.
              // </p>
            )}
          </div>
        </div>
      )}

      {/* <h2 className="text-xl font-bold mb-4">Vaccination List</h2> */}
      {isOpen && (
        <div>
          {filteredVaccinations.length > 0 ? (
            <div>
              <label htmlFor="">All Vaccination</label>
              <table className="min-w-full bg-white rounded-lg shadow-md mt-5">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">id</th>
                    <th className="py-2 px-4 border-b">Code</th>
                    <th className="py-2 px-4 border-b">protectionStartDate</th>
                    <th className="py-2 px-4 border-b">protectionEndDate</th>
                    <th className="py-2 px-4 border-b">animalId</th>
                    <th className="py-2 px-4 border-b">Animal Name</th>
                    <th className="py-2 px-4 border-b">Customer Name</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVaccinations?.map((vaccination, index) => {
                    return (
                      <tr key={vaccination.id} className="bg-gray-100">
                        <td className="py-2 px-4 border-b text-center">
                          {vaccination.id}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          {vaccination.code}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          {vaccination.protectionStartDate}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          {vaccination.protectionFinishDate}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          {vaccination.animal.id}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          {vaccination.animal.name}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          {vaccination.animal.customer.name}
                        </td>
                        <td className="py-2 px-4 border- text-center">
                          <button
                            id={index}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={handleUpdateVaccinationBtn}
                          >
                            Update
                          </button>
                          <button
                            id={vaccination.id}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleDeleteVaccination}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Loading/>
          )}
        </div>
      )}
    </div>
  )
}
