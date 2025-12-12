import { useState, useEffect } from 'react';
import { eventsAPI } from '../services/api';
// import { eventsAPI } from '../../services/api';

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredEvent, setFeaturedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventsAPI.getAll();
        
        if (response.success && response.data) {
          setEvents(response.data);
          
          // Find featured event
          const featured = response.data.find(event => event.featured);
          setFeaturedEvent(featured || response.data[0]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, featuredEvent, loading, error };
};

export default useEvents;
