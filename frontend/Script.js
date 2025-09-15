document.addEventListener('DOMContentLoaded', () => {
    // UI elements
    const videoUrlInput = document.getElementById('videoUrl');
    const searchBtn = document.getElementById('searchBtn');
    const videoDetailsSection = document.getElementById('videoDetails');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const videoTitle = document.getElementById('videoTitle');
    const channelName = document.getElementById('channelName');
    const videoDuration = document.getElementById('videoDuration');
    const downloadOptionsDiv = document.getElementById('downloadOptions');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('errorMessage');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    // New format option buttons
    const videoDownloadOptionBtn = document.getElementById('video-download-option');
    const audioDownloadOptionBtn = document.getElementById('audio-download-option');

    let currentVideoDetails = null;

    // Helper function to show toast notifications
    function createNotification(message, details, type) {
        const notification = document.createElement('div');
        notification.className = `toast-notification show ${type}`;
        notification.innerHTML = `
            <div>
                <strong>${message}</strong>
                <p>${details}</p>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Function to initiate video download
    function initiateDownload(videoId, itag, quality) {
        const downloadUrl = `${currentServerEndpoint}/api/download?videoId=${videoId}&itag=${itag}`;
        window.location.href = downloadUrl;
        createNotification('Download Started!', `Your video (${quality}) is now downloading.`, 'success');
    }

    // Function to initiate audio download
    function initiateAudioDownload(videoId) {
        const downloadUrl = `${currentServerEndpoint}/api/audio?videoId=${videoId}`;
        window.location.href = downloadUrl;
        createNotification('Audio Download Started!', `Your audio file is now downloading.`, 'success');
    }
    
    // Server endpoints to try
    const serverEndpoints = [
        'http://localhost:5500',
        'http://127.0.0.1:4000'
    ];
    
    let currentServerEndpoint = serverEndpoints[0];
    
    // Function to test server connection
    async function testServerConnection() {
        for (const endpoint of serverEndpoints) {
            try {
                const response = await fetch(`${endpoint}/api/videoInfo?url=test`, {
                    method: 'GET',
                    signal: AbortSignal.timeout(3000) // 3 second timeout
                });
                // Even if it returns an error, if we get a response, the server is running
                currentServerEndpoint = endpoint;
                return true;
            } catch (error) {
                continue;
            }
        }
        return false;
    }
    
    // Function to fetch video info from the backend
    async function fetchVideoInfo(url) {
        loader.style.display = 'block';
        errorMessage.style.display = 'none';
        videoDetailsSection.style.display = 'none';
        
        try {
            // First test if server is reachable
            const serverReachable = await testServerConnection();
            if (!serverReachable) {
                throw new Error('Cannot connect to server. Please ensure the backend server is running on port 4000.\n\nTo start the server:\n1. Open terminal/command prompt\n2. Navigate to the project directory\n3. Run: npm start');
            }
            
            const response = await fetch(`${currentServerEndpoint}/api/videoInfo?url=${encodeURIComponent(url)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(15000) // 15 second timeout
            });
            
            // Check for network errors (server not running)
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            currentVideoDetails = data;
            
            // Populate video details
            videoThumbnail.src = data.videoDetails.thumbnails[0].url;
            videoTitle.textContent = data.videoDetails.title;
            channelName.textContent = data.videoDetails.author.name;
            videoDuration.textContent = `Duration: ${formatDuration(data.videoDetails.lengthSeconds)}`;
            videoDetailsSection.style.display = 'block';

            updateDownloadOptions();
            
        } catch (error) {
            let errorMsg = error.message;
            if (error.name === 'TimeoutError') {
                errorMsg = 'Request timeout. Please check your internet connection and try again.';
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMsg = 'Cannot connect to server. Please ensure the backend server is running on port 4000.\n\nTo start the server:\n1. Open terminal in project directory\n2. Run: npm start';
            }
            
            errorMessage.innerHTML = errorMsg.replace(/\n/g, '<br>');
            errorMessage.style.display = 'block';
            createNotification('Connection Error', errorMsg.split('\n')[0], 'error');
        } finally {
            loader.style.display = 'none';
        }
    }

    // Function to update the download buttons based on the selected format
    function updateDownloadOptions() {
        if (!currentVideoDetails) return;

        downloadOptionsDiv.innerHTML = '';
        const isVideoActive = videoDownloadOptionBtn.classList.contains('active');

        if (isVideoActive) {
            // Create download buttons for video
            currentVideoDetails.formats.filter(f => f.qualityLabel).sort((a,b) => parseInt(b.qualityLabel) - parseInt(a.qualityLabel)).forEach(format => {
                const button = document.createElement('button');
                button.className = 'download-btn';
                button.innerHTML = `Download ${format.qualityLabel}`;
                button.onclick = () => initiateDownload(currentVideoDetails.videoDetails.videoId, format.itag, format.qualityLabel);
                downloadOptionsDiv.appendChild(button);
            });
        } else {
            // Create audio download button
            const audioButton = document.createElement('button');
            audioButton.className = 'download-btn audio';
            audioButton.textContent = 'Download as MP3';
            audioButton.onclick = () => initiateAudioDownload(currentVideoDetails.videoDetails.videoId);
            downloadOptionsDiv.appendChild(audioButton);
        }
    }

    // Event listeners
    searchBtn.addEventListener('click', () => {
        const url = videoUrlInput.value;
        if (url) {
            fetchVideoInfo(url);
        } else {
            createNotification('Invalid URL', 'Please enter a valid YouTube video URL.', 'error');
        }
    });

    videoDownloadOptionBtn.addEventListener('click', () => {
        videoDownloadOptionBtn.classList.add('active');
        audioDownloadOptionBtn.classList.remove('active');
        if (currentVideoDetails) {
            updateDownloadOptions();
        }
    });

    audioDownloadOptionBtn.addEventListener('click', () => {
        audioDownloadOptionBtn.classList.add('active');
        videoDownloadOptionBtn.classList.remove('active');
        if (currentVideoDetails) {
            updateDownloadOptions();
        }
    });

    mobileMenuBtn.addEventListener('click', () => {
        mainNav.querySelector('ul').classList.toggle('active');
    });

    // Simple duration formatter
    function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
});
