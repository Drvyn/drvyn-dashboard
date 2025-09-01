import { addDays, format, subDays } from 'date-fns';
import { Booking, InsuranceRequest, GeneralRequest } from './types';

const today = new Date();

export const bookings: Booking[] = [
  {
    "_id": "68a5ca3470bf3051f9346b8a",
    "brand": "Rolls Royce",
    "model": "Phantom",
    "fuelType": "Petrol",
    "year": "2018",
    "phone": "+919999999991",
    "date": format(subDays(today, 5), 'yyyy-MM-dd'),
    "time": "9:00 - 10:00",
    "address": "123 Luxury Lane",
    "serviceCenter": "COIMBATORE",
    "totalPrice": 17226,
    "cartItems": [
      { packageName: "Basic Service", price: 17226, quantity: 1 }
    ],
    "status": "completed",
    "createdAt": format(subDays(today, 5), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    "_id": "68a5ca3470bf3051f9346b8b",
    "brand": "Mercedes-Benz",
    "model": "S-Class",
    "fuelType": "Diesel",
    "year": "2021",
    "phone": "+919999999992",
    "date": format(subDays(today, 2), 'yyyy-MM-dd'),
    "time": "11:00 - 12:00",
    "address": "456 Prestige Ave",
    "serviceCenter": "CHENNAI",
    "totalPrice": 12500,
    "cartItems": [
        { packageName: "AC Service", price: 7500, quantity: 1 },
        { packageName: "Wheel Alignment", price: 5000, quantity: 1 }
    ],
    "status": "confirmed",
    "createdAt": format(subDays(today, 2), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    "_id": "68a5ca3470bf3051f9346b8c",
    "brand": "BMW",
    "model": "7 Series",
    "fuelType": "Petrol",
    "year": "2020",
    "phone": "+919999999993",
    "date": format(today, 'yyyy-MM-dd'),
    "time": "14:00 - 15:00",
    "address": "789 Elegance Blvd",
    "serviceCenter": "BENGALURU",
    "totalPrice": 15000,
    "cartItems": [
        { packageName: "Full Body Wash", price: 15000, quantity: 1 }
    ],
    "status": "pending",
    "createdAt": format(today, 'yyyy-MM-dd HH:mm:ss')
  },
    {
    "_id": "68a5ca3470bf3051f9346b8d",
    "brand": "Audi",
    "model": "A8",
    "fuelType": "Petrol",
    "year": "2022",
    "phone": "+919999999994",
    "date": format(addDays(today, 3), 'yyyy-MM-dd'),
    "time": "10:00 - 11:00",
    "address": "101 Grand Rd",
    "serviceCenter": "MUMBAI",
    "totalPrice": 14000,
    "cartItems": [
        { packageName: "Engine Detailing", price: 14000, quantity: 1 }
    ],
    "status": "pending",
    "createdAt": format(subDays(today, 1), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    "_id": "68a5ca3470bf3051f9346b8e",
    "brand": "Tesla",
    "model": "Model S",
    "fuelType": "Electric",
    "year": "2023",
    "phone": "+919999999995",
    "date": format(subDays(today, 10), 'yyyy-MM-dd'),
    "time": "15:00 - 16:00",
    "address": "212 Future St",
    "serviceCenter": "BENGALURU",
    "totalPrice": 20000,
    "cartItems": [
        { packageName: "Battery Checkup", price: 20000, quantity: 1 }
    ],
    "status": "completed",
    "createdAt": format(subDays(today, 10), 'yyyy-MM-dd HH:mm:ss')
  },
  {
    "_id": "68a5ca3470bf3051f9346b8f",
    "brand": "Porsche",
    "model": "Panamera",
    "fuelType": "Petrol",
    "year": "2019",
    "phone": "+919999999996",
    "date": format(subDays(today, 1), 'yyyy-MM-dd'),
    "time": "12:00 - 13:00",
    "address": "333 Speedster Way",
    "serviceCenter": "CHENNAI",
    "totalPrice": 18000,
    "cartItems": [
        { packageName: "Performance Tuning", price: 18000, quantity: 1 }
    ],
    "status": "cancelled",
    "createdAt": format(subDays(today, 1), 'yyyy-MM-dd HH:mm:ss')
  }
];

export const insuranceRequests: InsuranceRequest[] = [
  {
    "_id": "68a5ca2770bf3051f9346b89",
    "brand": "Rolls Royce",
    "model": "Phantom",
    "fuelType": "Petrol",
    "year": "2018",
    "phone": "+919999999981",
    "companyPolicyName": "Royal Shield Insurance",
    "createdAt": format(subDays(today, 8), 'yyyy-MM-dd HH:mm:ss'),
    "type": "insurance_request",
    "status": "completed"
  },
  {
    "_id": "68a5ca2770bf3051f9346b90",
    "brand": "Jaguar",
    "model": "F-Pace",
    "fuelType": "Diesel",
    "year": "2020",
    "phone": "+919999999982",
    "companyPolicyName": "Secure Drive Policies",
    "createdAt": format(subDays(today, 4), 'yyyy-MM-dd HH:mm:ss'),
    "type": "insurance_request",
    "status": "contacted"
  },
  {
    "_id": "68a5ca2770bf3051f9346b91",
    "brand": "Land Rover",
    "model": "Range Rover",
    "fuelType": "Petrol",
    "year": "2022",
    "phone": "+919999999983",
    "companyPolicyName": "All-Terrain Assurance",
    "createdAt": format(subDays(today, 1), 'yyyy-MM-dd HH:mm:ss'),
    "type": "insurance_request",
    "status": "new"
  },
  {
    "_id": "68a5ca2770bf3051f9346b92",
    "brand": "Volvo",
    "model": "XC90",
    "fuelType": "Diesel",
    "year": "2021",
    "phone": "+919999999984",
    "companyPolicyName": "Safe Journey Inc.",
    "createdAt": format(subDays(today, 15), 'yyyy-MM-dd HH:mm:ss'),
    "type": "insurance_request",
    "status": "rejected"
  },
    {
    "_id": "68a5ca2770bf3051f9346b93",
    "brand": "Mercedes-Benz",
    "model": "E-Class",
    "fuelType": "Petrol",
    "year": "2023",
    "phone": "+919999999985",
    "companyPolicyName": "Premium Auto Cover",
    "createdAt": format(subDays(today, 6), 'yyyy-MM-dd HH:mm:ss'),
    "type": "insurance_request",
    "status": "completed"
  }
];

export const generalRequests: GeneralRequest[] = [
  {
    "_id": "68a5ca1d70bf3051f9346b88",
    "brand": "Rolls Royce",
    "model": "Phantom",
    "fuelType": "Petrol",
    "year": "2018",
    "phone": "+919999999971",
    "createdAt": format(subDays(today, 3), 'yyyy-MM-dd HH:mm:ss'),
    "status": "resolved"
  },
  {
    "_id": "68a5ca1d70bf3051f9346b87",
    "brand": "Ford",
    "model": "Endeavour",
    "fuelType": "Diesel",
    "year": "2019",
    "phone": "+919999999972",
    "createdAt": format(subDays(today, 2), 'yyyy-MM-dd HH:mm:ss'),
    "status": "in-progress"
  },
  {
    "_id": "68a5ca1d70bf3051f9346b86",
    "brand": "Toyota",
    "model": "Fortuner",
    "fuelType": "Diesel",
    "year": "2021",
    "phone": "+919999999973",
    "createdAt": format(subDays(today, 1), 'yyyy-MM-dd HH:mm:ss'),
    "status": "new"
  },
    {
    "_id": "68a5ca1d70bf3051f9346b85",
    "brand": "Honda",
    "model": "City",
    "fuelType": "Petrol",
    "year": "2022",
    "phone": "+919999999974",
    "createdAt": format(subDays(today, 5), 'yyyy-MM-dd HH:mm:ss'),
    "status": "resolved"
  }
];
