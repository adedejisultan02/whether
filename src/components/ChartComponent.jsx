'use client';
import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import styled from 'styled-components';

Chart.register(annotationPlugin);

const ChartContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 400px;
  margin: 0 auto;
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 1rem;
  text-align: center;
`;

const ChartComponent = ({ data, filters }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!data || !data.days || data.days.length === 0) {
      return; 
    }

    const selectedDay = data.days.find((day) => {
      const dayDate = new Date(`${day.datetime}T12:00:00`);
      const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });
      return dayName.toLowerCase() === filters.day.toLowerCase();
    });

    if (!selectedDay || !selectedDay.hours) {
      return; 
    }

    const fullHours = selectedDay.hours;

    const filteredHours = fullHours.filter((hour) => {
      const hourNumber = parseInt(hour.datetime.split(':')[0], 10);
      if (filters.time === 'Morning') return hourNumber >= 8 && hourNumber <= 12;
      if (filters.time === 'Afternoon') return hourNumber >= 12 && hourNumber <= 17;
      if (filters.time === 'Evening') return hourNumber >= 17 && hourNumber <= 21;
      return false;
    });

    if (filteredHours.length === 0) {
      return; 
    }

    const firstFilteredHour = filteredHours[0];
    const lastFilteredHour = filteredHours[filteredHours.length - 1];

    const firstFilteredIndex = fullHours.findIndex(h => h.datetime === firstFilteredHour.datetime);
    const lastFilteredIndex = fullHours.findIndex(h => h.datetime === lastFilteredHour.datetime);

    const extendedStartIndex = Math.max(firstFilteredIndex - 2, 0);
    const extendedEndIndex = Math.min(lastFilteredIndex + 2, fullHours.length - 1);

    const extendedHours = fullHours.slice(extendedStartIndex, extendedEndIndex + 1);

    if (extendedHours.length === 0) {
      return; 
    }


    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = extendedHours.map((hour) => hour.datetime);
    const temperatures = extendedHours.map((hour) => hour.temp);
    const precipitation = extendedHours.map((hour) => hour.precipprob);
    const windSpeeds = extendedHours.map((hour) => hour.windspeed);

    const startFilterLabel = firstFilteredHour.datetime;
    const endFilterLabel = lastFilteredHour.datetime;

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Temperature (°F)',
            data: temperatures,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Precipitation Probability (%)',
            data: precipitation,
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Wind Speed (mph)',
            data: windSpeeds,
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          annotation: {
            annotations: {
              filteredRangeStart: {
                type: 'line',
                scaleID: 'x',
                value: startFilterLabel,
                borderColor: 'black',
                borderWidth: 2,
                borderDash: [4, 4],
                label: {
                  enabled: false,
                },
              },
              filteredRangeEnd: {
                type: 'line',
                scaleID: 'x',
                value: endFilterLabel,
                borderColor: 'black',
                borderWidth: 2,
                borderDash: [4, 4], 
                label: {
                  enabled: false, 
                },
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: `${filters.time}`,
            },
            grid: {
              display: false,
            },
          },
          y: {
            title: {
              display: false,
            //   text: 'Value',
            },
            grid: {
              display: false, 
            },
          },
        },
      },
    });
  }, [data, filters]);

  if (!data || !data.days || data.days.length === 0) {
    return <ErrorMessage>No data available to display the chart.</ErrorMessage>;
  }

  return (
    <ChartContainer>
      <canvas ref={chartRef}></canvas>
    </ChartContainer>
  );
};

export default ChartComponent;
