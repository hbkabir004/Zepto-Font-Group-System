# Zepto Apps Full Stack Developer Assignment | **Font Group System**

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Technologies Used](#technologies-used)
5. [Installation Guide ](#installation-guide)
6. [<code style="color : red">Don't Forget to Run PHP backend locally</code>](#install-dependencies-for-backend)
7. [How to Use](#how-to-use)

---

## Introduction

The **Zepto Font Group System** is a web-based Fullstack application that allows users to upload fonts (TTF format only), create font groups, and manage them with features like editing and deleting groups. The application is built using **React.js** and  **TailwindCSS** , providing a responsive and user-friendly interface for font management. This project is designed to showcase full-stack development capabilities, including file uploads, form validation, and dynamic UI rendering.

---

## Features

**1. Font Upload** :

* Users can upload TTF font files.
* The uploaded fonts are dynamically added to the browser using the `@font-face` rule for preview.
* Only TTF files are allowed, and invalid file types trigger an error alert.

**2. Font List Display :**

* After uploading, fonts are listed with their name and a preview of the font style.
* Users can delete individual fonts from the list.

**3. Font Group Creation :**

* Users can create font groups by selecting multiple fonts.
* Validation ensures that a group contains at least two fonts before submission.
* Users can dynamically add or remove fonts from the group form.

**4. Font Group Management :**

* Users can view a list of all font groups.
* Each group displays the number of fonts it contains.
* Users can edit or delete font groups.

**5. Responsive UI :**

* The interface is built with responsiveness in mind, ensuring usability across devices.

---

## Project Structure

Here’s a breakdown of the project directory structure:

```sh
Zepto-Font-Group-System/
│
├── backend/
│   ├── font-groups.php         # PHP script to handle font group creation, deletion, and retrieval
│   ├── upload.php              # PHP script to handle font file uploads (TTF files only)
│   └── uploads/   		# Directory for storing uploaded font files
│
├── frontend/
│   ├── public/
│   │── index.html                # Main HTML file
│   └── src/
│   	├── fonts                 # .ttf file fonts to test the application
│   	├── App.jsx               # Main application logic
│   	├── index.css             # Global styles, including TailwindCSS
│   	├── main.jsx          	  # React entry point
│       ├── package.json          # Node.js dependencies and project info
│ 	├── index.html        	  # Main HTML file
│ 	└── tailwind.config.js    # TailwindCSS configuration
│ 	└── vite.config.js    	  # Vite.js configuration
│
├── .gitignore                  # Git ignore file
├── README.md                   # Main project documentation (this file)
├── LICENSE                     # Project license (optional)
└── package.json                # Main project dependencies

```

---

## Technologies Used

* **React.js** : JavaScript library for building user interfaces.
* **Vite.js** : Fast and lightweight build tool for modern web development.
* **TailwindCSS** : Utility-first CSS framework for custom design.
* **JavaScript (ES6+)** **& OOP**: Core logic implementation.
* **HTML5 & CSS3** : Structure and styles for the project.
* **Node.js** : For managing dependencies and running the development server.
* **Core PHP & JS** : For building Backend System

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
2. **Install dependencies**  (For Frontend)

   ```sh
      git clone https://github.com/hbkabir004/Zepto-Font-Group-System.git
      cd Zepto-Font-Group-System
   ```

   Using  **npm** :

   ```sh
   npm install
   ```

   Or using  **yarn** :

   ```sh
   yarn install
   ```

   2.2 **Start the development server** :

   ```sh
   npm run dev
   ```

   This will start the application locally. Open your browser and navigate to [http://localhost:5173](http://localhost:5173/) to view the frontend app.

   3.1 **Install-Dependencies-For-Backend** 
   
   ```sh
      cd backend/
   ```
   
   3.2 **Start the development server** :
   
   ```sh
      php -S localhost:8000
   ```
   
   This will start the PHP Backend system locally. Open your browser and navigate to [http://localhost:8000](http://localhost:8000 "PHP Backend") to view the frontend app.
   
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
