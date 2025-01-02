import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../StoreContext/StoreContext';
import { useParams } from 'react-router-dom';
import Loader from '../../Components/Loader/Loader';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client'; // Import Socket.IO client
import 'react-toastify/dist/ReactToastify.css'; 
import './EventDetails.css';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { url, token } = useContext(StoreContext); 

    // Socket.IO connection instance
    useEffect(() => {
        const socket = io(url); // Connect to the WebSocket server

        // Listen for the `seatBooked` event
        socket.on('seatBooked', (data) => {
            if (data.eventId === id) {
                setEvent((prevEvent) => ({
                    ...prevEvent,
                    bookedSeats: data.bookedSeats,
                }));
                toast.info(`Seats updated for event: ${data.bookedSeats} booked!`);
            }
        });

        return () => {
            socket.disconnect(); // Disconnect when the component unmounts
        };
    }, [id, url]);

    useEffect(() => {
        const fetchEventDetails = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${url}/api/events/event-detail/${id}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch event details');
                }

                const data = await response.json();
                setEvent(data.event);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id, url]);

    const handleBooking = async () => {
        const isConfirmed = window.confirm(`Do you really want to book this event: "${event.title}"?`);
        if (!isConfirmed) return;

        setLoading(true);

        try {
            const token = localStorage.getItem('token'); 

            const response = await fetch(`${url}/api/events/${event._id}/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Seat booked successfully!');
            } else {
                toast.error(data.message || 'Error booking seat');
            }
        } catch (err) {
            toast.error(err.message || 'Error booking seat');
        } finally {
            setLoading(false);
        }
    };

    if (error) return <p>Error: {error}</p>;

    if (!event) return <p></p>;

    return (
        <div className="event-detail">
            {loading && <Loader/>}
            <div className="event-detail-top">
                <h2>{event.title}</h2>
                {token && <button onClick={handleBooking}>Book</button>}
            </div>

            <img src={`${event.image}`} alt={event.title} />
            <div className="seats">
                <p>Total Seats: {event.capacity}</p>
                <p>Booked Seats: {event.bookedSeats}</p>
                <p>Available Seats: {event.capacity - event.bookedSeats}</p>
            </div>
            <h3>Date and Time</h3>
            <p className="bottom1margin">{new Date(event.date).toLocaleString()}</p>
            <h3>Location</h3>
            <p className="bottom1margin">{event.location}</p>
            <h3>About This Event</h3>
            <p>{event.description}</p>
        </div>
    );
};

export default EventDetails;
