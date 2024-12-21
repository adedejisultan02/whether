'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  flex: 1;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const WeatherForm = ({ onSearch }) => {
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location);
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{alignItems: 'center', margin: '0px'}}>
      <Input
        type="text"
        placeholder="New York"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{border: '0px'}}
      />
      {/* <Button type="submit">Search</Button> */}
    </Form>
  );
};

export default WeatherForm;
