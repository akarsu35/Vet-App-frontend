import React, { useState } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Doctor from '../Doctor/Doctor'

import Appointment from '../Appointment/Appointment'
import Customer from '../Customer/Customer'
import Report from '../Report/Report'
import Vaccination from '../Vaccination/Vaccination'
import Workday from '../Workday/Workday'
import Navbar from '../../Components/Navbar/Navbar'
import Animal from '../Animal/Animal'

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)

  
  return (
    <div>
      {isOpen ? (
        <>
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="doctor" element={<Doctor />} />
            <Route path="/" element={<Animal />} />
            <Route path="appointment" element={<Appointment />} />
            <Route path="customer" element={<Customer />} />
            <Route path="report" element={<Report />} />
            <Route path="vaccination" element={<Vaccination />} />
            <Route path="workday" element={<Workday />} />
          </Routes>
        </>
      ) : (
        <section className="flex flex-col justify-center items-center mt-32  p-6 ">
          <div>
            <img
              alt="Veterinary Logo"
              src="./images/llogo1.png"
              className="h-[250px] w-[250px] object-cover rounded-full border-4 border-indigo-600"
            />
          </div>
          <div className="text-center mt-8 px-6 flex flex-col w-[36rem]">
            <h1 className="text-4xl font-extrabold text-indigo-800">
              Vet-App'e Hoş Geldiniz, Değerli Ekip Arkadaşlarımız!
            </h1>
            <p className="mt-6 text-xl text-indigo-600 leading-relaxed">
              Her gün,{' '}
              <span className="font-bold text-gray-200 text-2xl">
                hayvanların hayatlarını iyileştirmek
              </span>{' '}
              ve{' '}
              <span className="font-bold text-gray-200 text-2xl">
                onların sağlığını korumak
              </span>{' '}
              için gösterdiğiniz
              <span className="font-bold text-gray-200 text-2xl">
                {' '}
                özveri
              </span>{' '}
              ve{' '}
              <span className="font-bold text-gray-200 text-2xl">
                tutku
              </span>{' '}
              ile gurur duyuyoruz. Sizlerin gayreti sayesinde,{' '}
              <span className="font-bold text-gray-200 text-2xl">
                birçok hayvan daha sağlıklı
              </span>{' '}
              ve
              <span className="font-bold text-gray-200 text-2xl">
                {' '}
                mutlu bir yaşam
              </span>{' '}
              sürüyor. Hayvanlarımıza gösterdiğiniz{' '}
              <span className="font-bold text-gray-200 text-2xl">ilgi</span> ve
              onlara sunduğunuz{' '}
              <span className="font-bold text-gray-200 text-2xl">
                kaliteli bakım
              </span>{' '}
              için teşekkür ederiz. Hep birlikte, onların hayatında{' '}
              <span className="font-bold text-gray-200 text-2xl">
                fark yaratıyoruz!
              </span>
            </p>
          </div>
          <div>
            <button
              className="mt-8 inline-block rounded bg-indigo-600 px-12 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out transform hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-400"
              onClick={() => setIsOpen(true)}
            >
              Get Started Today
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
