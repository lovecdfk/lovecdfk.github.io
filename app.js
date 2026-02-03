
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadArea = document.getElementById('uploadArea');
    const epubUpload = document.getElementById('epubUpload');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const uploadsList = document.getElementById('uploadsList');
    const booksGrid = document.getElementById('booksGrid');
    const readerModal = document.getElementById('readerModal');
    const closeModal = document.getElementById('closeModal');
    const epubFrame = document.getElementById('epubFrame');
    const uploadTrigger = document.getElementById('uploadTrigger');
    const tryDemo = document.getElementById('tryDemo');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const bookTitle = document.getElementById('bookTitle');
    
    // Sample book data
    const sampleBooks = [
        {
            id: 1,
            title: "Introduction to Physics",
            author: "Dr. Robert Johnson",
            subject: "science",
            pages: 320,
            cover: "fas fa-atom"
        },
        {
            id: 2,
            title: "World History: Ancient Civilizations",
            author: "Prof. Maria Garcia",
            subject: "history",
            pages: 450,
            cover: "fas fa-landmark"
        },
        {
            id: 3,
            title: "Classic English Literature",
            author: "Dr. James Wilson",
            subject: "literature",
            pages: 280,
            cover: "fas fa-book"
        },
        {
            id: 4,
            title: "Advanced Calculus",
            author: "Dr. Susan Lee",
            subject: "mathematics",
            pages: 380,
            cover: "fas fa-calculator"
        },
        {
            id: 5,
            title: "Biology: The Living World",
            author: "Dr. Michael Chen",
            subject: "science",
            pages: 410,
            cover: "fas fa-dna"
        },
        {
            id: 6,
            title: "Modern American Poetry",
            author: "Prof. Emily Davis",
            subject: "literature",
            pages: 220,
            cover: "fas fa-pen-fancy"
        }
    ];
    
    // Sample uploads
    const sampleUploads = [
        { name: "Chemistry Fundamentals.epub", date: "2023-10-15", size: "12.4 MB" },
        { name: "Computer Science Basics.epub", date: "2023-10-10", size: "8.7 MB" },
        { name: "Philosophy Reader.epub", date: "2023-10-05", size: "15.2 MB" }
    ];
    
    // Initialize the page
    function init() {
        renderUploadsList();
        renderBooksGrid('all');
        setupEventListeners();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Upload area click
        uploadArea.addEventListener('click', function() {
            epubUpload.click();
        });
        
        // File upload change
        epubUpload.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
        
        // Drag and drop for upload area
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#4361ee';
            uploadArea.style.backgroundColor = '#f0f7ff';
        });
        
        uploadArea.addEventListener('dragleave', function() {
            uploadArea.style.borderColor = '#e9ecef';
            uploadArea.style.backgroundColor = '#fff';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#e9ecef';
            uploadArea.style.backgroundColor = '#fff';
            
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.name.endsWith('.epub') || file.name.endsWith('.epub3')) {
                    handleFileUpload(file);
                } else {
                    alert('Please upload only EPUB files (.epub or .epub3)');
                }
            }
        });
        
        // Modal close button
        closeModal.addEventListener('click', function() {
            readerModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        readerModal.addEventListener('click', function(e) {
            if (e.target === readerModal) {
                readerModal.style.display = 'none';
            }
        });
        
        // Upload trigger button
        uploadTrigger.addEventListener('click', function() {
            epubUpload.click();
        });
        
        // Try demo button
        tryDemo.addEventListener('click', function() {
            bookTitle.textContent = "Introduction to Physics - EPUB Reader";
            readerModal.style.display = 'flex';
            
            // Load demo book in iframe after a short delay
            setTimeout(() => {
                // In a real implementation, we would pass the EPUB file to the iframe
                // For this demo, we'll just show the reader interface
                console.log("Loading demo EPUB...");
            }, 300);
        });
        
        // Filter buttons for library
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                // Filter books
                const filter = this.getAttribute('data-filter');
                renderBooksGrid(filter);
            });
        });
    }
    
    // Handle file upload
    function handleFileUpload(file) {
        // Show progress bar
        uploadProgress.style.display = 'block';
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                
                // Upload complete
                setTimeout(() => {
                    // Add to uploads list
                    addToUploadsList(file);
                    
                    // Hide progress bar
                    uploadProgress.style.display = 'none';
                    progressFill.style.width = '0%';
                    progressText.textContent = 'Uploading: 0%';
                    
                    // Show success message
                    alert(`"${file.name}" uploaded successfully! You can now read it in the EPUB reader.`);
                    
                    // Open the reader with the uploaded file
                    openReaderWithFile(file);
                }, 500);
            }
            
            // Update progress bar
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Uploading: ${Math.round(progress)}%`;
        }, 200);
    }
    
    // Add uploaded file to the list
    function addToUploadsList(file) {
        const uploadDate = new Date().toISOString().split('T')[0];
        const fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
        
        // Create upload item
        const uploadItem = document.createElement('div');
        uploadItem.className = 'upload-item';
        uploadItem.innerHTML = `
            <div class="upload-item-icon">
                <i class="fas fa-file-alt"></i>
            </div>
            <div class="upload-item-info">
                <h4>${file.name}</h4>
                <p>Uploaded: ${uploadDate} | Size: ${fileSize}</p>
            </div>
        `;
        
        // Add click event to open reader
        uploadItem.addEventListener('click', function() {
            openReaderWithFile(file);
        });
        
        // Add to the beginning of the list
        uploadsList.insertBefore(uploadItem, uploadsList.firstChild);
        
        // Limit to 5 items
        if (uploadsList.children.length > 5) {
            uploadsList.removeChild(uploadsList.lastChild);
        }
    }
    
    // Render uploads list
    function renderUploadsList() {
        uploadsList.innerHTML = '';
        
        sampleUploads.forEach(upload => {
            const uploadItem = document.createElement('div');
            uploadItem.className = 'upload-item';
            uploadItem.innerHTML = `
                <div class="upload-item-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="upload-item-info">
                    <h4>${upload.name}</h4>
                    <p>Uploaded: ${upload.date} | Size: ${upload.size}</p>
                </div>
            `;
            
            uploadsList.appendChild(uploadItem);
        });
    }
    
    // Render books grid with filter
    function renderBooksGrid(filter) {
        booksGrid.innerHTML = '';
        
        const filteredBooks = filter === 'all' 
            ? sampleBooks 
            : sampleBooks.filter(book => book.subject === filter);
        
        filteredBooks.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
                <div class="book-cover">
                    <i class="${book.cover}"></i>
                </div>
                <div class="book-info">
                    <h4>${book.title}</h4>
                    <p class="book-author">${book.author}</p>
                    <div class="book-meta">
                        <span>${book.pages} pages</span>
                        <span class="book-subject">${book.subject.charAt(0).toUpperCase() + book.subject.slice(1)}</span>
                    </div>
                    <button class="read-book-btn" data-book-id="${book.id}">
                        <i class="fas fa-book-open"></i> Read Book
                    </button>
                </div>
            `;
            
            // Add event listener to the read button
            const readBtn = bookCard.querySelector('.read-book-btn');
            readBtn.addEventListener('click', function() {
                openReaderWithBook(book);
            });
            
            booksGrid.appendChild(bookCard);
        });
    }
    
    // Open reader with a book
    function openReaderWithBook(book) {
        bookTitle.textContent = `${book.title} - EPUB Reader`;
        readerModal.style.display = 'flex';
        
        // In a real implementation, we would pass the actual EPUB file to the reader
        // For this demo, we'll simulate loading
        console.log(`Opening book: ${book.title}`);
        
        // We could pass data to the iframe using URL parameters or postMessage
        // epubFrame.src = `epub-reader/epub-reader.html?book=${encodeURIComponent(book.title)}`;
    }
    
    // Open reader with uploaded file
    function openReaderWithFile(file) {
        bookTitle.textContent = `${file.name} - EPUB Reader`;
       
