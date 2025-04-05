import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000'; // Change this to your actual backend URL

const App = () => {
  const [fonts, setFonts] = useState([]);
  const [selectedFonts, setSelectedFonts] = useState([{ fontName: '' }]);
  const [fontGroups, setFontGroups] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch fonts and groups on component mount
  useEffect(() => {
    fetchFonts();
    fetchFontGroups();
  }, []);

  // Fetch all fonts from the database
  const fetchFonts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-fonts.php`);
      const data = await response.json();
      if (data.status === 'success') {
        setFonts(data.fonts);
        
        // Dynamically inject fonts into document
        data.fonts.forEach(font => {
          const newStyle = document.createElement('style');
          newStyle.appendChild(
            document.createTextNode(`
              @font-face {
                font-family: '${font.name}';
                src: url(${API_BASE_URL}/${font.path});
              }
            `)
          );
          document.head.appendChild(newStyle);
        });
      }
    } catch (error) {
      console.error('Error fetching fonts:', error);
    }
  };

  // Fetch all font groups from the database
  const fetchFontGroups = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/font-groups.php?action=getGroups`);
      const data = await response.json();
      if (data.status === 'success') {
        setFontGroups(data.fontGroups);
      }
    } catch (error) {
      console.error('Error fetching font groups:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file?.name?.endsWith('.ttf')) {
      alert('Please upload only TTF files!');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('fontFile', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.status === 'success') {
        // Add the new font to the list
        const newFont = {
          id: data.fontId,
          name: data.fontName,
          path: data.fontPath,
        };
        
        setFonts(prevFonts => [...prevFonts, newFont]);

        // Dynamically inject font into document
        const newStyle = document.createElement('style');
        newStyle.appendChild(
          document.createTextNode(`
            @font-face {
              font-family: '${newFont.name}';
              src: url(${API_BASE_URL}/${newFont.path});
            }
          `)
        );
        document.head.appendChild(newStyle);
      } else {
        alert(data.message || 'Error uploading font');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error uploading font:', error);
      alert('Error uploading font. Please try again.');
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Delete a font
  const deleteFont = async (fontId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete-font.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: fontId }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setFonts(prevFonts => prevFonts.filter(font => font.id !== fontId));
      } else {
        alert(data.message || 'Error deleting font');
      }
    } catch (error) {
      console.error('Error deleting font:', error);
      alert('Error deleting font. Please try again.');
    }
  };

  // Add new row for selecting fonts in group
  const handleAddRow = () => {
    setSelectedFonts([...selectedFonts, { fontName: '' }]);
  };

  // Handle font selection change
  const handleFontChange = (index, value) => {
    const updatedFonts = selectedFonts.map((font, i) =>
      i === index ? { ...font, fontName: value } : font
    );
    setSelectedFonts(updatedFonts);
  };

  // Create a font group with selected fonts
  const handleCreateGroup = async () => {
    const validFonts = selectedFonts.filter((font) => font.fontName !== '');

    if (validFonts.length < 2) {
      alert('Please select at least two fonts to create a group.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/font-groups.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          group: validFonts
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setFontGroups(data.fontGroups);
        // Reset the font selection after creating a group
        setSelectedFonts([{ fontName: '' }]);
      } else {
        alert(data.message || 'Error creating font group');
      }
    } catch (error) {
      console.error('Error creating font group:', error);
      alert('Error creating font group. Please try again.');
    }
  };

  // Delete a font group
  const handleDeleteGroup = async (groupId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/font-groups.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          id: groupId
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setFontGroups(data.fontGroups);
      } else {
        alert(data.message || 'Error deleting font group');
      }
    } catch (error) {
      console.error('Error deleting font group:', error);
      alert('Error deleting font group. Please try again.');
    }
  };

  // Edit a font group
  const handleEditGroup = (groupId) => {
    const groupToEdit = fontGroups.find(group => group.id === groupId);
    if (groupToEdit) {
      setSelectedFonts(groupToEdit.fonts);
      handleDeleteGroup(groupId);
    }
  };

  return (
    <div className="container mx-auto p-5 mb-10">
      {/* Upload Section with Drag and Drop */}
      <div className={`border-dashed border-2 ${isDragging ? 'border-blue-400' : 'border-gray-400'} rounded-lg p-10 text-center mb-6`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
      >
        <label htmlFor="fileUpload" className="cursor-pointer">
          <p className="text-lg">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">Only TTF File Allowed</p>
        </label>
        <input
          type="file"
          id="fileUpload"
          accept=".ttf"
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-4">
          <p>Uploading font...</p>
        </div>
      )}

      {/* Font List Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Our Fonts</h2>
        {fonts.length === 0 ? (
          <p>No fonts uploaded yet.</p>
        ) : (
          <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="px-4 py-3 text-left">Font Name</th>
                <th className="px-4 py-3 text-left">Preview</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {fonts.map((font) => (
                <tr key={font.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{font.name}</td>
                  <td className="px-4 py-3" style={{ fontFamily: `${font.name}` }}>
                    Example Style
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteFont(font.id)}
                      className="text-red-500 hover:text-red-600 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Font Group Creation */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Create Font Group</h2>
        {selectedFonts.map((font, index) => (
          <div key={index} className="flex items-center mb-2">
            <select
              value={font.fontName}
              onChange={(e) => handleFontChange(index, e.target.value)}
              className="border px-3 py-2 mr-4"
            >
              <option value="">Select a font</option>
              {fonts.map((font) => (
                <option key={font.id} value={font.name}>{font.name}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Add Row Button */}
        <button
          onClick={handleAddRow}
          className="bg-blue-500 text-white px-4 py-2 rounded-md my-4 mr-6"
        >
          Add Row
        </button>

        {/* Create Group Button */}
        <button
          onClick={handleCreateGroup}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Create Font Group
        </button>
      </div>

      {/* List of Font Groups */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Font Groups</h2>
        {fontGroups.length === 0 ? (
          <p>No font groups created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="px-4 py-3 text-left">Group</th>
                  <th className="px-4 py-3 text-left">Count</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-600 text-sm font-light">
                {fontGroups.map((group) => (
                  <tr key={group.id} className="border-b border-gray-200 hover:bg-gray-50 font-medium">
                    <td className="px-4 py-3">
                      {group.fonts.map((font, i) => (
                        <span key={i} className="mr-2 bg-gray-200 text-gray-700 py-1 px-2 rounded-lg">
                          {font.fontName}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      {group.fonts.length}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEditGroup(group.id)}
                        className="text-blue-500 hover:text-blue-600 mr-4 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="text-red-500 hover:text-red-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;