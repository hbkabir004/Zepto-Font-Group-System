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

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file && file.name.endsWith('.ttf')) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const font = {
          name: file.name.replace('.ttf', ''), // Remove the .ttf extension
          data: fileReader.result,
        };

        fontGroup.addFont(font);
        setFonts([...fontGroup.getFonts()]);

        // Dynamically inject font into document
        const newStyle = document.createElement('style');
        newStyle.appendChild(
          document.createTextNode(`
            @font-face {
              font-family: '${font.name}';
              src: url(${font.data});
            }
          `)
        );
        document.head.appendChild(newStyle);
      };

      fileReader.readAsDataURL(file);
    } else {
      alert('Please upload only TTF files!');
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
  const handleCreateGroup = () => {
    const validFonts = selectedFonts.filter((font) => font.fontName !== '');

    if (validFonts.length < 2) {
      alert('Please select at least two fonts to create a group.');
      return;
    }

    fontGroup.addGroup(validFonts);
    setFontGroups([...fontGroup.getGroups()]);

    // Reset the font selection after creating a group
    setSelectedFonts([{ fontName: '' }]);
  };

  // Handle delete group
  const handleDeleteGroup = (index) => {
    fontGroup.deleteGroup(index);
    setFontGroups([...fontGroup.getGroups()]);
  };

  // Handle edit group
  const handleEditGroup = (index) => {
    const groupToEdit = fontGroup.getGroups()[index];
    setSelectedFonts(groupToEdit);
    handleDeleteGroup(index); // Remove old group before editing
  };

  return (
    <div className="container mx-auto p-5">
      {/* Upload Section */}
      <div className="border-dashed border-2 border-gray-400 rounded-lg p-10 text-center mb-6">
        <label htmlFor="fileUpload" className="cursor-pointer">
          <p className="text-lg">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">Only TTF File Allowed</p>
        </label>
        <input
          type="file"
          id="fileUpload"
          accept=".ttf"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Font List Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Our Fonts</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Font Name</th>
              <th className="px-4 py-2">Preview</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fonts.map((font) => (
              <tr key={font.name}>
                <td className="border px-4 py-2">{font.name}</td>
                <td className="border px-4 py-2" style={{ fontFamily: `${font.name}` }}>
                  Example Style
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => fontGroup.deleteFont(font.name)}
                    className="text-red-500 hover:text-red-700"
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
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Group</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fontGroups.map((group, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {group.map((font, i) => (
                      <span key={i} className="mr-2">{font.fontName}</span>
                    ))}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEditGroup(index)}
                      className="text-blue-500 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(index)}
                      className="text-red-500"
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
    </div>
  );
};

export default App;
