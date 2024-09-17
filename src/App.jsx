import React, { useState } from 'react';

class FontGroup {
  constructor() {
    this.fonts = [];
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
}

const App = () => {
  const [fontGroup] = useState(new FontGroup());
  const [fonts, setFonts] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    // Check if the file has .ttf extension
    if (file && file.name.endsWith('.ttf')) {
      const fileReader = new FileReader();

      // Read the file as a DataURL (base64 string)
      fileReader.onload = () => {
        const font = {
          name: file.name.replace('.ttf', ''), // Remove the .ttf extension for simplicity
          data: fileReader.result
        };

        // Add the font to the FontGroup class
        fontGroup.addFont(font);
        setFonts([...fontGroup.getFonts()]);

        // Inject font into the document dynamically with @font-face
        const newStyle = document.createElement('style');
        newStyle.appendChild(document.createTextNode(`
          @font-face {
            font-family: '${font.name}';
            src: url(${font.data});
          }
        `));
        document.head.appendChild(newStyle); // Add the font to the document head
      };

      fileReader.readAsDataURL(file); // Read the font file as base64 data
    } else {
      alert('Please upload only TTF files!');
    }
  };

  const handleDelete = (fontName) => {
    fontGroup.deleteFont(fontName);
    setFonts([...fontGroup.getFonts()]);
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
                    onClick={() => handleDelete(font.name)}
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
    </div>
  );
};

export default App;
