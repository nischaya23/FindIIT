import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import { getProducts } from "../api/products";
import './MapPage.css';
import Navbar from './NavBar';

const MapPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Filter state variables
  const [filterType, setFilterType] = useState('all'); // 'all', 'lost', or 'found'
  const [filterTag, setFilterTag] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch items from server
  useEffect(() => {
    const fetchItems = async (search = "") => {
      try {
        setLoading(true);
        const res = await getProducts(search);
        // console.log(res.data);
        setItems(res.data.data);

        // console.log(items.length);
      } catch (error) {
        // console.error('Error fetching items:', error);
        alert(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // useEffect(() => {
    // console.log("Updated products:", items.length);
    // console.log(items);
// }, [items]);

  // Helper: parse date string into Date object
  const parseDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const filteredItems = items
    .map(item => ({
      id: item._id, // Map MongoDB _id to id for consistency
      name: item.category,
      type: item.itemStatus.toLowerCase(),      //!
      lat: Number(item.coordinates.latitude),   //!
      lng: Number(item.coordinates.longitude),  //!
      date: item.createdAt,                     //!
      description: item.description,
      tags: item.tags || [],
      user: item.uploadedBy || {}               //!
    }))
    .filter(item => {
      // Type filter (only lost and found now)
      const typeMatches = filterType === 'all' || item.type === filterType;
      
      // Tag filter
      const tagMatches = !filterTag || (item.tags && item.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())));
      
      // Search query filter
      const query = searchQuery.toLowerCase();
      const searchMatches = !query || 
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (item.user && (
          (item.user.name && item.user.name.toLowerCase().includes(query)) ||
          (item.user.email && item.user.email.toLowerCase().includes(query))
        ));


      // Date range filter (compare only the date portion)
      let dateMatches = true;
      if (dateFrom || dateTo) {
        const itemDate = parseDate(item.date);
        if (itemDate) {
          const itemDateStr = itemDate.toISOString().slice(0, 10);
          if (dateFrom) {
            const fromDate = new Date(dateFrom);
            dateMatches = itemDate >= fromDate;
          }
          if (dateMatches && dateTo) {
            const toDate = new Date(dateTo);
            dateMatches = itemDate <= toDate;
          }
        } else {
          dateMatches = false;
        }
      }
      
      return typeMatches && tagMatches && searchMatches && dateMatches;
    });

  // Clear all filters
  const clearFilters = () => {
    setFilterType('all');
    setFilterTag('');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
  };

  // console.log("Filtered Items for Map:", filteredItems);
  return (
    <>
    <Navbar />
    <div className="map-page">
      <div className="map-header">
        <div className="filter-controls">
          <button 
            className="filter-btn"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            Filter
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

      {/* Filter dropdown overlay */}
      {showFilterPanel && (
        <div className="filter-dropdown">
          <div className="filter-section">
            <label>Type:</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          <div className="filter-section">
            <label>Tag:</label>
            <input 
              type="text" 
              placeholder="Filter by tag" 
              value={filterTag} 
              onChange={(e) => setFilterTag(e.target.value)} 
            />
          </div>
          <div className="filter-section">
            <label>Date Range:</label>
            <div className="date-range">
              <input 
                type="date" 
                value={dateFrom} 
                onChange={(e) => setDateFrom(e.target.value)} 
              />
              <span>to</span>
              <input 
                type="date" 
                value={dateTo} 
                onChange={(e) => setDateTo(e.target.value)} 
              />
            </div>
          </div>
          <div className="filter-section">
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        </div>
      )}

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
    </>
  );
};

export default MapPage;
