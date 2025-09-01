// lib/persistence.ts - simpler alternative
import { Booking, InsuranceRequest, GeneralRequest } from "./types";

export const STORAGE_KEYS = {
  BOOKINGS: 'drvyn-bookings',
  INSURANCE_REQUESTS: 'drvyn-insurance-requests',
  GENERAL_REQUESTS: 'drvyn-general-requests'
};

export const persistence = {
  // Save data to localStorage
  saveData: <T>(key: string, data: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Load data from localStorage
  loadData: <T>(key: string): T | null => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  },

  // Update booking status
  updateBooking: (_id: string, status: string) => {
    try {
      const currentData = persistence.loadData<Booking[]>(STORAGE_KEYS.BOOKINGS) || [];
      const updatedData = currentData.map(item => 
        item._id === _id ? { ...item, status } : item
      );
      persistence.saveData(STORAGE_KEYS.BOOKINGS, updatedData);
      return updatedData;
    } catch (error) {
      console.error('Error updating booking:', error);
      return null;
    }
  },

  // Update insurance request status
  updateInsuranceRequest: (_id: string, status: string) => {
    try {
      const currentData = persistence.loadData<InsuranceRequest[]>(STORAGE_KEYS.INSURANCE_REQUESTS) || [];
      const updatedData = currentData.map(item => 
        item._id === _id ? { ...item, status } : item
      );
      persistence.saveData(STORAGE_KEYS.INSURANCE_REQUESTS, updatedData);
      return updatedData;
    } catch (error) {
      console.error('Error updating insurance request:', error);
      return null;
    }
  },

  // Update general request status
  updateGeneralRequest: (_id: string, status: string) => {
    try {
      const currentData = persistence.loadData<GeneralRequest[]>(STORAGE_KEYS.GENERAL_REQUESTS) || [];
      const updatedData = currentData.map(item => 
        item._id === _id ? { ...item, status } : item
      );
      persistence.saveData(STORAGE_KEYS.GENERAL_REQUESTS, updatedData);
      return updatedData;
    } catch (error) {
      console.error('Error updating general request:', error);
      return null;
    }
  }
};