import React from 'react';
import { useParams } from 'react-router-dom';
import EmployeeProfile from '../components/EmployeeProfile';

const EmployeeProfilePage = () => {
  const { id: employeeId } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <EmployeeProfile employeeId={employeeId} />
    </div>
  );
};

export default EmployeeProfilePage;
