import React, { useState } from 'react';

class FontGroup {
  constructor() {
    this.fonts = [];
    this.groups = [];
  }

  addFont(font) {
    this.fonts.push(font);
  }

  deleteFont(fontName) {
    this.fonts = this.fonts.filter((font) => font.name !== fontName);
  }

  getFonts() {
    return this.fonts;
  }

  addGroup(group) {
    this.groups.push(group);
  }

  deleteGroup(groupIndex) {
    this.groups.splice(groupIndex, 1);
  }

  updateGroup(groupIndex, updatedGroup) {
    this.groups[groupIndex] = updatedGroup;
  }

  getGroups() {
    return this.groups;
  }
}

const App = () => {
  const [fontGroup] = useState(new FontGroup());
  const [fonts, setFonts] = useState([]);
  const [selectedFonts, setSelectedFonts] = useState([{ fontName: '' }]);
  const [fontGroups, setFontGroups] = useState([]);
  const [isDragging, setIsDragging] = useState(false); // New state to track dragging

  // Handle File Upload
  const handleFileUpload = (file) => {
    if (file?.name?.endsWith('.ttf')) {
      const formData = new FormData();
      formData.append('fontFile', file);

      fetch('http://localhost:8000/upload.php', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            const font = {
              name: data.fontName,
              path: data.fontPath,
            };
            fontGroup.addFont(font);
            setFonts([...fontGroup.getFonts()]);

            // Dynamically inject font into document
            const newStyle = document.createElement('style');
            newStyle.appendChild(
              document.createTextNode(`
                @font-face {
                  font-family: '${font.name}';
                  src: url(${font.path});
                }
              `)
            );
            document.head.appendChild(newStyle);
          } else {
            alert(data.message);
          }
        });
    } else {
      alert('Please upload only TTF files!');
    }
  };


  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true); // Indicate dragging
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false); // Reset dragging state

    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragLeave = () => {
    setIsDragging(false); // Reset dragging state when leaving the area
  };

  const deleteFont = (fontName) => {
    setFonts((prevFonts) => prevFonts.filter((font) => font.name !== fontName));
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
  const handleCreateGroup = () => {
    const validFonts = selectedFonts.filter((font) => font.fontName !== '');

    if (validFonts.length < 2) {
      alert('Please select at least two fonts to create a group.');
      return;
    }

    fetch('http://localhost:8000/font-groups.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'create',
        group: JSON.stringify(validFonts),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setFontGroups(data.fontGroups);
        } else {
          alert(data.message);
        }
      });
  };

  // Handle delete group
  const handleDeleteGroup = (index) => {
    fetch('http://localhost:8000/font-groups.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'delete',
        index: index,
      }),
    }).then((response) => response.json())
      .then((data) => {
        console.log("data", data);

        if (data.status === 'success') {
          setFontGroups(data.fontGroups);
        } else {
          alert(data.message);
        }
      });

    console.log(fontGroups); // Your array of font groups
    console.log(index); // The index you're trying to access
  };

  // Handle edit group
  const handleEditGroup = (index) => {
    const groupToEdit = fontGroup.getGroups()[index];
    setSelectedFonts(groupToEdit);
    handleDeleteGroup(index); // Remove old group before editing
  };



  return (
    <div className="container mx-auto p-5 mb-10">
      {/* Upload Section with Drag and Drop */}
      <div
        className={`border-dashed border-2 ${isDragging ? 'border-blue-400' : 'border-gray-400'} 
          rounded-lg p-10 text-center mb-6`}
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

      {/* Font List Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Our Fonts</h2>
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
              <tr key={font.name} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{font.name}</td>
                <td className="px-4 py-3" style={{ fontFamily: `${font.name}` }}>
                  Example Style
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteFont(font.name)}
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
              {fonts.map((font, i) => (
                <option key={i} value={font.name}>{font.name}</option>
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
              {/* <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="px-4 py-3 text-left">Group</th>
                  <th className="px-4 py-3 text-left">Count</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead> */}
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="px-4 py-3 text-left">Group</th>
                  <th className="px-4 py-3 text-left">Count</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-600 text-sm font-light">
                {fontGroups.map((group, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 font-medium">
                    <td className="px-4 py-3">
                      {group.map((font, i) => (
                        <span key={i} className="mr-2 bg-gray-200 text-gray-700 py-1 px-2 rounded-lg">
                          {font.fontName}
                        </span>
                      ))}
                    </td>
                    <td className="px-4 py-3"> {/* Count column */}
                      {group.length} {/* Calculate the number of fonts */}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEditGroup(index)}
                        className="text-blue-500 hover:text-blue-600 mr-4 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(index)}
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
