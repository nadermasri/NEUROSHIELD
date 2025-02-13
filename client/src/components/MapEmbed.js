// client/src/components/MapEmbed.js
import React from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 450px;
  margin: 2rem 0;
  border: 0;
`;

const MapEmbed = () => {
  return (
    <MapContainer>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13815.172063780294!2d35.47188315957995!3d33.90247948112997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f16d4749cf5f1%3A0xb5d00d1272ef1d01!2sAmerican%20University%20of%20Beirut%2C%20Beirut!5e1!3m2!1sen!2slb!4v1739443579987!5m2!1sen!2slb"
        width="600"
        height="450"
        style={{ border: 0, width: '100%', height: '100%' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </MapContainer>
  );
};

export default MapEmbed;
