import React, { useState } from 'react';

const FontList = () => {
    // Sample font list state
    const [fonts, setFonts] = useState([
        { id: 1, name: 'Roboto', previewStyle: { fontFamily: 'Roboto, sans-serif' } },
        { id: 2, name: 'Times New Roman', previewStyle: { fontFamily: '"Times New Roman", serif' } },
        { id: 3, name: 'Verdana', previewStyle: { fontFamily: 'Verdana, sans-serif' } },
    ]);

    // Function to delete a font from the list
    const deleteFont = (id) => {
        setFonts(fonts.filter((font) => font.id !== id));
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-10">
            <h2 className="text-lg font-semibold mb-4">Our Fonts</h2>
            <p className="text-sm text-gray-600 mb-6">Browse a list of Zepto fonts to build your font group.</p>

            <table className="table-auto w-full text-left border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="px-4 py-2 font-medium text-gray-600">FONT NAME</th>
                        <th className="px-4 py-2 font-medium text-gray-600">PREVIEW</th>
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {fonts.map((font) => (
                        <tr key={font.id} className="border-b">
                            <td className="px-4 py-2 text-gray-800">{font.name}</td>
                            <td className="px-4 py-2" style={font.previewStyle}>
                                Example Style
                            </td>
                            <td className="px-4 py-2 text-red-500 cursor-pointer" onClick={() => deleteFont(font.id)}>
                                Delete
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FontList;
