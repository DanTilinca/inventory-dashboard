import { useState, useEffect } from 'react';

function InviteCodeMenu({ isOpen, onClose }) {
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState('');

  useEffect(() => {
    const fetchCodes = async () => {
      const response = await fetch('http://localhost:4000/api/inviteCode/getAllCodes');
      const data = await response.json();
      setCodes(data);
    };

    if (isOpen) {
      fetchCodes();
    }
  }, [isOpen]);

  const handleAddCode = async () => {
    const response = await fetch('http://localhost:4000/api/inviteCode/addCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: newCode }),
    });

    const data = await response.json();

    if (data.success) {
      // Add the new code as an object
      setCodes([...codes, { code: newCode }]);
      setNewCode('');
    } else {
      // Handle error...
    }
  };

  const handleRemoveCode = async (codeToRemove) => {
    const response = await fetch(`http://localhost:4000/api/inviteCode/removeCode/${codeToRemove}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.success) {
      setCodes(codes.filter((code) => code.code !== codeToRemove));
    } else {
      // Handle error...
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
        <div className="relative z-10 w-full max-w-md p-4 mx-auto overflow-hidden bg-white rounded-lg shadow-lg">
          <button className="absolute top-0 right-0 mt-2 mr-2" onClick={onClose}>
            X
          </button>
          <h2 className="text-lg font-semibold text-center">Invite Codes</h2>
          <ul className="mt-4">
            {codes.map((code, index) => (
              <li key={index} className="flex justify-between">
                <span>{code.code}</span>
                <button
                  className="text-red-500"
                  onClick={() => handleRemoveCode(code.code)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <button
              className="w-full px-3 py-2 mt-2 font-semibold text-white bg-blue-600 rounded-lg"
              onClick={handleAddCode}
            >
              Add Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InviteCodeMenu;
