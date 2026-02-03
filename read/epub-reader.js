document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const settingsPanel = document.getElementById('settingsPanel');
    const tocPanel = document.getElementById('tocPanel');
    const searchPanel = document.getElementById('searchPanel');
    const settingsToggle = document.getElementById('settingsToggle');
    const tocToggle = document.getElementById('tocToggle');
    const searchToggle = document.getElementById('searchToggle');
    const closeSettings = document.getElementById('closeSettings');
    const closeToc = document.getElementById('closeToc');
    const closeSearch = document.getElementById('closeSearch');
    const themeOptions = document.querySelectorAll('.theme-option');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    const lineHeightSelect = document.getElementById('lineHeightSelect');
    const epubContent = document.getElementById('viewer');
    const demoContent = document.querySelector('.demo-content');
    const prevChapterBtn = document.getElementById('prevChapter');
    const nextChapterBtn = document.getElementById('nextChapter');
    const fontDecreaseBtn = document.getElementById('fontDecrease');
    const fontIncreaseBtn = document.getElementById('fontIncrease');
    const themeToggleBtn = document.getElementById('themeToggle');
    const fullscreenToggle = document.getElementById('fullscreenToggle');
    const bookmarkToggle = document.getElementById('bookmarkToggle');
    
    // Current reader state
    let currentTheme = 'light';
    let currentFontSize = 18;
    let currentChapter = 1;
    let isBookmarked = false;
    
    // Initialize the reader
    function initReader() {
        // Load saved settings from localStorage
        loadSettings();
        
        // Set up event listeners
        setupEventListeners();
        
        // For demo purposes, we'll show the demo content
        // In a real implementation, we would initialize EPUB.js here
        console.log("EPUB Reader initialized");
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Panel toggles
        settingsToggle.addEventListener('click', function() {
            settingsPanel.style.right = '0';
            closeOtherPanels(settingsPanel);
        });
        
        tocToggle.addEventListener('click', function() {
            tocPanel.style.right = '0';
            closeOtherPanels(tocPanel);
        });
        
        searchToggle.addEventListener('click', function() {
            searchPanel.style.right = '0';
            closeOtherPanels(searchPanel);
        });
        
        // Close panel buttons
        closeSettings.addEventListener('click', function() {
            settingsPanel.style.right = '-400px';
        });
        
        closeToc.addEventListener('click', function() {
            tocPanel.style.right = '-400px';
        });
        
        closeSearch.addEventListener('click', function() {
            searchPanel.style.right = '-400px';
        });
        
        // Theme selection
        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                themeOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked option
                this.classList.add('active');
                // Apply theme
                const theme = this.getAttribute('data-theme');
                applyTheme(theme);
                // Save to localStorage
                localStorage.setItem('readerTheme', theme);
            });
        });
        
        // Font size slider
        fontSizeSlider.addEventListener('input', function() {
            currentFontSize = this.value;
            applyFontSize(currentFontSize);
            // Save to localStorage
            localStorage.setItem('readerFontSize', currentFontSize);
        });
        
        // Font size buttons
        fontDecreaseBtn.addEventListener('click', function() {
            if (currentFontSize > 14) {
                currentFontSize--;
                fontSizeSlider.value = currentFontSize;
                applyFontSize(currentFontSize);
                localStorage.setItem('readerFontSize', currentFontSize);
            }
        });
        
        fontIncreaseBtn.addEventListener('click', function() {
            if (currentFontSize < 24) {
                currentFontSize++;
                fontSizeSlider.value = currentFontSize;
                applyFontSize(currentFontSize);
                localStorage.setItem('readerFontSize', currentFontSize);
            }
        });
        
        // Font family select
        fontFamilySelect.addEventListener('change', function() {
            applyFontFamily(this.value);
            localStorage.setItem('readerFontFamily', this.value);
        });
        
        // Line height select
        lineHeightSelect.addEventListener('change', function() {
            applyLineHeight(this.value);
            localStorage.setItem('readerLineHeight', this.value);
        });
        
        // Navigation buttons
        prevChapterBtn.addEventListener('click', function() {
            if (currentChapter > 1) {
                currentChapter--;
                updateChapterInfo();
                // In a real implementation, load the previous chapter
                console.log(`Loading chapter ${currentChapter}`);
            }
        });
        
        nextChapterBtn.addEventListener('click', function() {
            if (currentChapter < 12) { // Assuming 12 chapters total
                currentChapter++;
                updateChapterInfo();
                // In a real implementation, load the next chapter
                console.log(`Loading chapter ${currentChapter}`);
            }
        });
        
        // Theme toggle button
        themeToggleBtn.addEventListener('click', function() {
            // Cycle through themes
            const themes = ['light', 'sepia', 'dark'];
            const currentIndex = themes.indexOf(currentTheme);
            const nextIndex = (currentIndex + 1) % themes.length;
            const nextTheme = themes[nextIndex];
            
            // Update active theme button
            themeOptions.forEach(opt => opt.classList.remove('active'));
            document.querySelector(`.theme-option[data-theme="${nextTheme}"]`).classList.add('active');
            
            // Apply theme
            applyTheme(nextTheme);
            localStorage.setItem('readerTheme', nextTheme);
        });
        
        // Fullscreen toggle
        fullscreenToggle.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable fullscreen: ${err.message}`);
                });
                fullscreenToggle.innerHTML = '<i class="fas fa-compress"></i>';
                fullscreenToggle.title = "Exit Fullscreen";
            } else {
                document.exitFullscreen();
                fullscreenToggle.innerHTML = '<i class="fas fa-expand"></i>';
                fullscreenToggle.title = "Fullscreen";
            }
        });
        
        // Bookmark toggle
        bookmarkToggle.addEventListener('click', function() {
            isBookmarked = !isBookmarked;
            if (isBookmarked) {
                bookmarkToggle.innerHTML = '<i class="fas fa-bookmark"></i>';
                bookmarkToggle.title = "Remove Bookmark";
                showNotification("Page bookmarked!");
                // In a real implementation, save bookmark position
                localStorage.setItem(`bookmark_${getCurrentBookId()}`, JSON.stringify({
                    chapter: currentChapter,
                    page: 1, // In real implementation, get current page
                    timestamp: new Date().toISOString()
                }));
            } else {
                bookmarkToggle.innerHTML = '<i class="far fa-bookmark"></i>';
                bookmarkToggle.title = "Bookmark";
                showNotification("Bookmark removed");
                localStorage.removeItem(`bookmark_${getCurrentBookId()}`);
            }
        });
        
        // Close panels when clicking outside (for mobile)
        document.addEventListener('click', function(event) {
            // Close settings panel if clicked outside
            if (!settingsPanel.contains(event.target) && event.target !== settingsToggle) {
                settingsPanel.style.right = '-400px';
            }
            
            // Close toc panel if clicked outside
            if (!tocPanel.contains(event.target) && event.target !== tocToggle) {
                tocPanel.style.right = '-400px';
            }
            
            // Close search panel if clicked outside
            if (!searchPanel.contains(event.target) && event.target !== searchToggle) {
                searchPanel.style.right = '-400px';
            }
        });
    }
    
    // Close other panels when opening one
    function closeOtherPanels(activePanel) {
        const panels = [settingsPanel, tocPanel, searchPanel];
        panels.forEach(panel => {
            if (panel !== activePanel) {
                panel.style.right = '-400px';
            }
        });
    }
    
    // Apply theme to reader
    function applyTheme(theme) {
        currentTheme = theme;
        
        // Remove all theme classes
        document.body.classList.remove('light-theme-active', 'sepia-theme-active', 'dark-theme-active');
        
        // Add current theme class
        document.body.classList.add(`${theme}-theme-active`);
        
        // Update demo content for theme
        if (demoContent) {
            if (theme === 'dark') {
                demoContent.style.color = '#e0e0e0';
            } else if (theme === 'sepia') {
                demoContent.style.color = '#5c4b37';
            } else {
                demoContent.style.color = '#333333';
            }
        }
    }
    
    // Apply font size
    function applyFontSize(size) {
        if (epubContent) {
            epubContent.style.fontSize = `${size}px`;
        }
    }
    
    // Apply font family
    function applyFontFamily(fontFamily) {
        if (epubContent) {
            epubContent.style.fontFamily = fontFamily;
        }
    }
    
    // Apply line height
    function applyLineHeight(lineHeight) {
        if (epubContent) {
            epubContent.style.lineHeight = lineHeight;
        }
    }
    
    // Update chapter info display
    function updateChapterInfo() {
        const chapterInfo = document.querySelector('.chapter-info');
        if (chapterInfo) {
            chapterInfo.textContent = `Chapter ${currentChapter} of 12`;
        }
    }
    
    // Show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'reader-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: fadeInOut 3s ease;
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Load saved settings from localStorage
    function loadSettings() {
        // Load theme
        const savedTheme = localStorage.getItem('readerTheme') || 'light';
        applyTheme(savedTheme);
        
        // Update active theme button
        themeOptions.forEach(opt => opt.classList.remove('active'));
        document.querySelector(`.theme-option[data-theme="${savedTheme}"]`).classList.add('active');
        
        // Load font size
        const savedFontSize = localStorage.getItem('readerFontSize') || 18;
        currentFontSize = savedFontSize;
        fontSizeSlider.value = savedFontSize;
        applyFontSize(savedFontSize);
        
        // Load font family
        const savedFontFamily = localStorage.getItem('readerFontFamily') || "'Noto Serif', serif";
        fontFamilySelect.value = savedFontFamily;
        applyFontFamily(savedFontFamily);
        
        // Load line height
        const savedLineHeight = localStorage.getItem('readerLineHeight') || '1.5';
        lineHeightSelect.value = savedLineHeight;
        applyLineHeight(savedLineHeight);
        
        // Load bookmark if exists
        const bookId = getCurrentBookId();
        const savedBookmark = localStorage.getItem(`bookmark_${bookId}`);
        if (savedBookmark) {
            isBookmarked = true;
            bookmarkToggle.innerHTML = '<i class="fas fa-bookmark"></i>';
            bookmarkToggle.title = "Remove Bookmark";
        }
    }
    
    // Get current book ID (for demo, we use a fixed value)
    function getCurrentBookId() {
        // In a real implementation, this would get the actual book ID
        // For demo, we'll use a fixed value or extract from URL
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('book') || 'demo-physics-book';
    }
    
    // Initialize the reader
    initReader();
});
