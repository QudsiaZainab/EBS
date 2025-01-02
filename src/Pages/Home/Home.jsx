import React, { useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory
import { StoreContext } from '../../StoreContext/StoreContext';
import './Home.css';
import ForYou from '../../Components/ForYou/ForYou';
import Loader from '../../Components/Loader/Loader';
import ReactPaginate from 'react-paginate';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('all');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();
    


    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);

            try {
                let apiUrl;
                if (selectedTab === 'all') {
                    apiUrl = `${url}/api/events/upcoming?page=${currentPage + 1}`;
                } else if (selectedTab === 'foryou' && token) {
                    apiUrl = `${url}/api/auth/userevents?page=${currentPage + 1}`;
                } else {
                    setLoading(false);
                    return;
                }

                const response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }

                const data = await response.json();

                setEvents(data.events || []);
                setTotalPages(Math.ceil(data.total / 5));

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();

    }, [selectedTab, url, token, currentPage]);

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        setCurrentPage(0); // Reset to first page when switching tabs
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleEventClick = (eventId) => {
        navigate(`/event/${eventId}`);
    };

    const isPrevDisabled = currentPage === 0;
    const isNextDisabled = currentPage === totalPages - 1;


    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <div id="hero-img">
                <img src="images/1920x1080 (1).jpg" alt="" />
            </div>
            <nav>
                <p
                    className={selectedTab === 'all' ? 'active-tab' : ''}
                    onClick={() => handleTabChange('all')}
                >
                    All Events
                </p>
                <p
                    className={selectedTab === 'foryou' ? 'active-tab' : ''}
                    onClick={() => handleTabChange('foryou')}
                >
                    For You
                </p>
            </nav>
            <h2 id="heading">Upcoming Events</h2>
            {loading && <Loader />}
            {selectedTab === 'foryou' && !token ? (
                <ForYou />
            ) : (
                <div>
                    {events.length === 0 ? (
                        <p className="events">No events found.</p>
                    ) : (
                        <div className="events">
                            {events.map((event) => (
                                <div
                                    className="event"
                                    key={event._id}
                                    onClick={() => handleEventClick(event._id)} // Handle event click
                                >
                                    <div className="image">
                                        <img src={event.image} alt={event.name} />
                                    </div>
                                    <div className="event-right">
                                        <h3>{event.title}</h3>
                                        <p className="description">{event.description}</p>
                                        <div className="event-footer">
                                            <p>
                                                {event.capacity - event.bookedSeats}/{event.capacity} seats available
                                            </p>
                                            <p>{new Date(event.date).toLocaleString()}, {event.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <ReactPaginate
                        previousLabel={"← Previous"}
                        nextLabel={"Next →"}
                        breakLabel={"..."}
                        pageCount={totalPages}
                        onPageChange={handlePageChange}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        forcePage={currentPage}
                        previousClassName={isPrevDisabled ? "disabled" : ""}
                        nextClassName={isNextDisabled ? "disabled" : ""}
                        previousLinkClassName={isPrevDisabled ? "disabled" : ""}
                        nextLinkClassName={isNextDisabled ? "disabled" : ""}
                    />
                </div>
            )}
        </div>
    );
};

export default Home;
