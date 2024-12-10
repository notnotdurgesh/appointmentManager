import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Make sure to install axios: npm install axios

// Base URL for your backend API
const API_BASE_URL = 'https://sad-caritta-durgesj-d63a9822.koyeb.app'; 

export interface Appointment {
  _id?: string; 
  userId?: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status?: 'completed' | 'scheduled' | 'cancelled';
  note?: string;
}

export function useAppointmentData(userId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/appointments`);
      
      // Transform data to match Appointment interface
      const transformedAppointments = response.data.appointments.map((apt: Appointment) => ({
        ...apt,
        date: new Date(apt.date).toISOString().split('T')[0], // Ensure date is in YYYY-MM-DD format
        status: apt.status || 'scheduled'
      }));

      setAppointments(transformedAppointments);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to fetch appointments');
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing appointment
  const updateAppointment = useCallback(async (updatedAppointment: Appointment) => {
    try {
      // Ensure we have both userId and _id for the update endpoint
      if (!updatedAppointment._id) {
        throw new Error('Appointment ID are required');
      }

      const response = await axios.put(
        `${API_BASE_URL}/appointments/${updatedAppointment._id}`, 
        updatedAppointment
      );

      // Update local state to reflect the updated appointment
      setAppointments(prevAppointments => 
        prevAppointments.map(apt => 
          apt._id === updatedAppointment._id ? response.data.appointment : apt
        )
      );

      return response.data.appointment;
    } catch (err) {
      console.error('Failed to update appointment:', err);
      throw err;
    }
  }, [userId]);

  // Create a new appointment
  const createAppointment = useCallback(async (newAppointment: Appointment) => {
    try {
      // Ensure we have userId
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await axios.post(
        `${API_BASE_URL}/book/appointment`, 
        { ...newAppointment, userId }
      );

      // Add the new appointment to local state
      setAppointments(prevAppointments => [
        ...prevAppointments, 
        response.data.appointment
      ]);

      return response.data.appointment;
    } catch (err) {
      console.error('Failed to create appointment:', err);
      throw err;
    }
  }, [userId]);

  // Delete an appointment (Note: Backend doesn't have a delete endpoint, so this is a placeholder)
  const deleteAppointment = useCallback(async (appointmentId: string) => {
    try {
      // If backend provides a delete endpoint, replace this with actual delete call
      setAppointments(prevAppointments => 
        prevAppointments.filter(apt => apt._id !== appointmentId)
      );
    } catch (err) {
      console.error('Failed to delete appointment:', err);
      throw err;
    }
  }, []);

  // Cancel an appointment (uses update with status change)
  const cancelAppointment = useCallback(async (appointmentId: string) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      // Find the current appointment to get its details
      const currentAppointment = appointments.find(apt => apt._id === appointmentId);
      if (!currentAppointment) {
        throw new Error('Appointment not found');
      }

      const response = await axios.put(
        `${API_BASE_URL}/appointments/${userId}/${appointmentId}`, 
        { ...currentAppointment, status: 'cancelled' }
      );

      // Update local state
      setAppointments(prevAppointments => 
        prevAppointments.map(apt => 
          apt._id === appointmentId 
            ? { ...apt, status: 'cancelled' } 
            : apt
        )
      );

      return response.data.appointment;
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
      throw err;
    }
  }, [userId, appointments]);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { 
    appointments, 
    isLoading, 
    error,
    fetchAppointments,
    updateAppointment,
    createAppointment,
    deleteAppointment,
    cancelAppointment 
  };
}