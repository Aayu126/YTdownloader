# YouTube Downloader

A simple and fast YouTube video downloader web application that allows you to download videos in various formats and extract audio as MP3.

## Features

- Download YouTube videos in multiple quality options (360p, 720p, 1080p, etc.)
- Extract audio from YouTube videos as MP3
- Simple and user-friendly web interface
- Fast downloads with optimized server processing
- Mobile-responsive design
- No registration required

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher) - [Download here](https://nodejs.org/)

### Quick Start

#### Option 1: Using the batch file (Windows)
1. Double-click `start-server.bat` to automatically install dependencies and start the server

#### Option 2: Manual setup
1. Open terminal/command prompt in the project directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

### Accessing the Application

1. After starting the server, you'll see: `Server running on port 4000`
2. Open your web browser and go to one of:
   - Open `frontend/YT.html` directly in your browser, OR
   - Set up a local web server for the frontend (optional)

### Usage

1. Copy a YouTube video URL
2. Paste it in the search box on the website
3. Choose between Video or Audio (MP3) format
4. Click Search to load video information
5. Select your preferred quality and click Download

## Troubleshooting

### "Failed to fetch" error
- Make sure the server is running (you should see "Server running on port 4000")
- Check that no other application is using port 4000
- Try refreshing the webpage

### Server won't start
- Make sure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check for port conflicts (close other applications using port 4000)

### Downloads don't work
- Ensure the YouTube URL is valid and accessible
- Some videos may be restricted or private
- Check your internet connection

## Project Structure

```
YTdownloader/
├── server.js           # Backend server (Express.js)
├── package.json        # Node.js dependencies
├── start-server.bat    # Windows startup script
├── frontend/
│   ├── YT.html        # Main webpage
│   ├── Script.js      # Frontend JavaScript
│   └── styles.css     # CSS styles
└── README.md          # This file
```

## Technologies Used

- **Backend**: Node.js, Express.js, ytdl-core, fluent-ffmpeg
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Features**: CORS enabled, responsive design, error handling

## License

This project is for educational purposes. Please respect YouTube's terms of service and copyright laws when downloading content.