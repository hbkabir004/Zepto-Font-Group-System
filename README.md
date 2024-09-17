# Zepto Apps Full Stack Developer Assignment | **Font Group System**

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Technologies Used](#technologies-used)
5. [Installation Guide](#installation-guide)
6. [How to Use](#how-to-use)

---

## Introduction

The **Zepto Font Group System** is a web-based application that allows users to upload fonts (TTF format only), create font groups, and manage them with features like editing and deleting groups. The application is built using **React.js** and  **TailwindCSS** , providing a responsive and user-friendly interface for font management. This project is designed to showcase full-stack development capabilities, including file uploads, form validation, and dynamic UI rendering.

---

## Features

1. **Font Upload** :

* Users can upload TTF font files.
* The uploaded fonts are dynamically added to the browser using the `@font-face` rule for preview.
* Only TTF files are allowed, and invalid file types trigger an error alert.

1. **Font List Display** :

* After uploading, fonts are listed with their name and a preview of the font style.
* Users can delete individual fonts from the list.

1. **Font Group Creation** :

* Users can create font groups by selecting multiple fonts.
* Validation ensures that a group contains at least two fonts before submission.
* Users can dynamically add or remove fonts from the group form.

1. **Font Group Management** :

* Users can view a list of all font groups.
* Each group displays the number of fonts it contains.
* Users can edit or delete font groups.

1. **Responsive UI** :

* The interface is built with responsiveness in mind, ensuring usability across devices.

---

## Project Structure

Here’s a breakdown of the project directory structure:

```sh
│
├── public/
│   └── index.html        # Main HTML file
├── src/
│   ├── fonts             # .ttf file fonts to test the application
│   ├── App.jsx           # Main application logic
│   ├── index.css         # Global styles, including TailwindCSS
│   ├── main.jsx          # React entry point
│   
├── package.json          # Node.js dependencies and project info
├── index.html        	  # Main HTML file
├── README.md             # Project documentation
└── tailwind.config.js    # TailwindCSS configuration
└── vite.config.js    	  # Vite.js configuration
```

---

## Technologies Used

* **React.js** : JavaScript library for building user interfaces.
* **Vite.js** : Fast and lightweight build tool for modern web development.
* **TailwindCSS** : Utility-first CSS framework for custom design.
* **JavaScript (ES6+)** **& OOP**: Core logic implementation.
* **HTML5 & CSS3** : Structure and styles for the project.
* **Node.js** : For managing dependencies and running the development server.

---

## Installation Guide

### Prerequisites

Ensure you have the following tools installed on your machine:

* **Node.js** (v16 or higher)
* **npm** or **yarn**

### Steps to Install

1. **Clone the repository** :

   ```sh
   git clone https://github.com/hbkabir004/Zepto-Font-Group-System.git
   cd Zepto-Font-Group-System
   ```
2. **Install dependencies** :
   Using  **npm** :

   ```sh
   npm install
   ```

   Or using  **yarn** :

   ```sh
   yarn install
   ```
3. **Start the development server** :

   ```sh
   npm run dev
   ```

   This will start the application locally. Open your browser and navigate to [http://localhost:5173](http://localhost:5173/) to view the app.

---

## How to Use

###### **Uploading Fonts** :

* Drag and drop a `.ttf` font file into the upload area or click to browse for a file.
* Upon successful upload, the font will appear in the "Our Fonts" list, displaying the font name and a preview in the uploaded style.

###### **Creating Font Groups** :

* Click "Add Row" to add a new font selection field.
* Select at least two fonts from the dropdown to create a group.
* Once the group is valid, click "Submit" to save the group.
* The group will be displayed in the "Font Group List" with an option to edit or delete it.

###### **Managing Font Groups** :

* View the list of all font groups, including the number of fonts in each group.
* Edit or delete font groups directly from the list.
