import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import './MapPage.css';

const MapPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'lost', or 'found'
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch items from server
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be a call to your API
        const response = await fetch('/api/items');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter and search items
  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="map-page">
      <div className="map-header">
        <div className="filter-controls">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'lost' ? 'active' : ''}`}
            onClick={() => setFilter('lost')}
          >
            Lost
          </button>
          <button 
            className={`filter-btn ${filter === 'found' ? 'active' : ''}`}
            onClick={() => setFilter('found')}
          >
            Found
          </button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">Search</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading map...</div>
      ) : (
        <MapComponent 
          items={filteredItems}
          onItemSelect={(item) => console.log('Selected item:', item)}
        />
      )}
      
      <div className="map-footer">
        <div className="legend">
          <div className="legend-item">
            <span className="lost-icon"></span> Lost Items
          </div>
          <div className="legend-item">
            <span className="found-icon"></span> Found Items
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;