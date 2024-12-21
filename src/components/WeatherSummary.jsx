'use client';
import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  /* border: 2px solid #f0f0f0; */
  /* border-radius: 8px; */
  background-color: #fff;
  width: 100%;
  max-width: 400px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    width: 100%;

    li {
      margin: 0.5rem 0;
      font-size: 1rem;
      color: #555;
      display: flex;
      align-items: center;
      gap: 5px;
    
      /* justify-content: space-between; */
    }

    strong {
      color: #333;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 1rem;
`;

const WeatherSummary = ({ title, data, filters, weekOffset, color='#333' }) => {
  if (!data || !data.days || data.days.length === 0) {
    return <ErrorMessage>No data available for the selected day and time.</ErrorMessage>;
  }

  // Adjust day matching for timezone issues
  const selectedDay = data.days.find((day) => {
    const dayDate = new Date(`${day.datetime}T12:00:00`);
    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });

    return dayName.toLowerCase() === filters.day.toLowerCase();
  });

  if (!selectedDay || !selectedDay.hours) {
    return (
      <ErrorMessage>
        No hourly data available for {filters.day} with the current week offset ({weekOffset}). Try a different date or adjust the offset.
      </ErrorMessage>
    );
  }

  const hourlyData = selectedDay.hours.filter((hour) => {
    const hourNumber = parseInt(hour.datetime.split(':')[0], 10); // Extract the hour from "HH:MM:SS"
    if (filters.time === 'Morning') return hourNumber >= 8 && hourNumber < 12;
    if (filters.time === 'Afternoon') return hourNumber >= 12 && hourNumber < 17;
    if (filters.time === 'Evening') return hourNumber >= 17 && hourNumber < 21;
    return false;
  });

  if (hourlyData.length === 0) {
    return (
      <ErrorMessage>
        No data available for the selected time range ({filters.time}).
      </ErrorMessage>
    );
  }

  // Use the first hour's data as the summary for the selected time range
  const summary = hourlyData[0];

  return (
    <SummaryContainer >
      <h2 color={color}>{title}</h2>
      <div style={{display: 'flex', gap: '50px'}}>
        { 
        <Image 
            src="/cloudy.svg"
            height={100}
            width={100}
            alt='location img'
        />}
      <ul>
        <li>
          <span>{summary.conditions || 'Unknown'} {summary.temp.toFixed(1)}°F</span>
        </li>
        <li>
            <Image 
                src="/wind.svg"
                height={40}
                width={30}
                alt='location img'
            />
          <span>winds {summary.windspeed.toFixed(1)} mph</span>
        </li>
        <li>
            <Image 
                src="/rain.svg"
                height={40}
                width={30}
                alt='location img'
            />
          <span>{summary.precipprob.toFixed(1)}% chance rain</span>
        </li>
      </ul>
      </div>
    </SummaryContainer>
  );
};

export default WeatherSummary;
