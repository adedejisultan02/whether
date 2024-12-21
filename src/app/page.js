'use client';
import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from '@/utils/weather';
import WeatherForm from '@/components/WeatherForm';
import WeatherSummary from '@/components/WeatherSummary';
import ChartComponent from '@/components/ChartComponent';
import styled from 'styled-components';
import Image from 'next/image';

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  color: #333;
  text-align: center;
  width: 100%;
  /* height: 100vh; */
  margin-inline: auto;
  background-color: white;
`;

const LocationHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  /* flex-direction: column; */
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 2px solid #f0f0f0;

  .filters {
    display: flex;
    gap: 0rem;

    select {
      padding: 0.5rem;
      border: 0px solid #ccc;
      border-radius: 4px;
    }
  }
`;

const WeatherVisualization = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem;
`;

const WeatherPanel = styled.div`
  /* border: 2px solid #f0f0f0;
  border-radius: 8px; */
  padding: 1rem;
  min-width: 300px;
  text-align: left;

  h3 {
    text-align: center;
  }
`;

const NavArrow = styled.button`
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
`;

const LocationWrapper = styled.div`
    display: flex;
    gap: 0px;
    align-items: center;
    justify-content: center;
    /* margin: 100; */
`
const FilterWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0px;
`

const WeatherContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
`
// style={{ display: 'flex', gap: '1.5rem' }}

export default function HomePage() {
  const [weatherData, setWeatherData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [filters, setFilters] = useState({
    day: 'Friday',
    time: 'Morning',
  });
  const [weekOffset, setWeekOffset] = useState(0);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("new york");

  useEffect(() => {
    const fetchData = async () => {
      if (!location) return;

      setError(null);
      try {
        const data = await fetchWeatherData(location, filters.day, weekOffset);
        const comparison = await fetchWeatherData(location, filters.day, weekOffset + 1);
        setWeatherData(data);
        setComparisonData(comparison);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      }
    };

    fetchData();
  }, [location, filters, weekOffset]);

  const handleSearch = (location) => {
    setLocation(location);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));
  };

  const navigateWeeks = (direction) => {
    setWeekOffset((prevOffset) => prevOffset + direction);
  };

  return (
    <AppContainer>
      <LocationHeader>
        <LocationWrapper>
            <Image 
                src="/location.svg"
                height={30}
                width={30}
                alt='location img'
            />
            <WeatherForm onSearch={handleSearch} />
        </LocationWrapper>
        
        <FilterWrapper className="filters">
          {/* <label htmlFor="day-select">Day:</label> */}
          <Image 
                src="/clock.svg"
                height={40}
                width={30}
                alt='location img'
            />
          <select
            id="day-select"
            value={filters.day}
            onChange={(e) => handleFilterChange('day', e.target.value)}
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>

          {/* <label htmlFor="time-select">Time:</label> */}
          <select
            id="time-select"
            value={filters.time}
            onChange={(e) => handleFilterChange('time', e.target.value)}
          >
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </FilterWrapper>
      </LocationHeader>
      <WeatherVisualization>
        <NavArrow onClick={() => navigateWeeks(-1)}>&lt;</NavArrow>
        <WeatherContainer>
          {weatherData && (
            <WeatherPanel>
              <WeatherSummary
                title={`This ${filters.day} - ${filters.time} (Week offset: ${weekOffset})`}
                data={weatherData}
                filters={filters}
                color='red'
              />
              <ChartComponent data={weatherData} filters={filters} />
            </WeatherPanel>
          )}
          {comparisonData && (
            <WeatherPanel>
              <WeatherSummary
                title={`Next ${filters.day} - ${filters.time} (Week offset: ${weekOffset + 1})`}
                data={comparisonData}
                filters={filters}
              />
              <ChartComponent data={comparisonData} filters={filters} />
            </WeatherPanel>
          )}
        </WeatherContainer>
        <NavArrow onClick={() => navigateWeeks(1)}>&gt;</NavArrow>
      </WeatherVisualization>
      {error && <p className="error-message">{error}</p>}
    </AppContainer>
  );
}
