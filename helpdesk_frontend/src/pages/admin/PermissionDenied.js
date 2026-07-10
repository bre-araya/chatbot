import React from 'react';

const PermissionDenied = () => (
  <div className="permission-denied">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0012 3.75v1.5a7.5 7.5 0 010 15v1.5a9 9 0 006.364-2.636zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <h2>Permission Denied</h2>
    <p>You do not have the required permissions to view this page.</p>
  </div>
);

export default PermissionDenied;