import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../StoreContext/StoreContext';
import { useParams } from 'react-router-dom';
import Loader from '../../Components/Loader/Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EventDetails.css';
import Pusher from 'pusher-js';
// import io from 'socket.io-client';

// const socket = io('https://ebs-backend-3d2o.vercel.app', {
//     transports: ['websocket'], 
// });

const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    useTLS: true
});

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { url, token } = useContext(StoreContext); // If using a base URL context

    useEffect(() => {

        // Log the WebSocket connection status
        // socket.on('connect', () => {
        //     console.log('WebSocket connected:', socket.id);  // Log the socket ID to confirm the connection
        // });

        // socket.on('connect_error', (err) => {
        //     console.error('WebSocket connection error:', err);  // Log any connection errors
        // });

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

        // WebSocket Listener for Real-Time Seat Updates
        // socket.on('updateSeats', (updatedEvent) => {
        //     console.log("Received seat update:", updatedEvent);  // Log the seat update to ensure the event is triggered
            
        //     if (updatedEvent.eventId === id) {
        //         setEvent((prev) => ({
        //             ...prev,
        //             bookedSeats: updatedEvent.bookedSeats,
        //         }));
        //     }
        // });

        // // Clean up socket connection when the component is unmounted
        // return () => {
        //     socket.off('updateSeats');  // Unsubscribe from WebSocket event when component unmounts
        //     socket.disconnect();  // Disconnect socket on component unmount
        // };

        const channel = pusher.subscribe('event-booking');
        channel.bind('seatBooked', (updatedEvent) => {
            if (updatedEvent.eventId === id) {
                setEvent((prev) => ({
                    ...prev,
                    bookedSeats: updatedEvent.bookedSeats,
                }));
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };

    }, [id, url]);

    const handleBooking = async () => {
        // Show confirmation dialog
        const isConfirmed = window.confirm(`Do you really want to book this event: "${event.title}"?`);
        if (!isConfirmed) return; // If user cancels, do nothing
    
        setLoading(true); // Show loader while booking
    
        try {
            const token = localStorage.getItem('token'); 
    
            const response = await fetch(`${url}/api/events/${event._id}/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Pass the token in Authorization header
                },
                body: JSON.stringify({}),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Show success toast
                toast.success('Seat booked successfully!');
            } else {
                // Show error toast or alert
                toast.error(data.message || 'Error booking seat');
            }
        } catch (err) {
            // Show error toast if API call fails
            toast.error(err.message || 'Error booking seat');
        } finally {
            setLoading(false); // Hide loader after API call finishes
        }
    };
    

    
    if (error) return <p>Error: {error}</p>;

    if (!event) return <p></p>;

    return (
        <div className="event-detail">
            {loading && <Loader/>}
            <div className="event-detail-top">
                <h2>{event.title}</h2>
                {token&&<button onClick={handleBooking}>Book</button>}
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
