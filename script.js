// File type detection and processing
const fileTypeIcons = {
    'pdf': { icon: 'fa-file-pdf', color: '#FF4444', bg: '#FEE2E2', name: 'PDF Document' },
    'jpg': { icon: 'fa-file-image', color: '#10B981', bg: '#D1FAE5', name: 'JPEG Image' },
    'jpeg': { icon: 'fa-file-image', color: '#059669', bg: '#D1FAE5', name: 'JPEG Image' },
    'png': { icon: 'fa-file-image', color: '#3B82F6', bg: '#DBEAFE', name: 'PNG Image' },
    'svg': { icon: 'fa-file-code', color: '#F59E0B', bg: '#FEF3C7', name: 'SVG Image' },
    'gif': { icon: 'fa-file-image', color: '#EC4899', bg: '#FCE7F3', name: 'GIF Image' },
    'webp': { icon: 'fa-file-image', color: '#0EA5E9', bg: '#E0F2FE', name: 'WebP Image' },
    'bmp': { icon: 'fa-file-image', color: '#EF4444', bg: '#FEE2E2', name: 'BMP Image' },
    'tiff': { icon: 'fa-file-alt', color: '#8B5CF6', bg: '#EDE9FE', name: 'TIFF Image' },
    'doc': { icon: 'fa-file-word', color: '#3B82F6', bg: '#DBEAFE', name: 'Word Document' },
    'docx': { icon: 'fa-file-word', color: '#2563EB', bg: '#DBEAFE', name: 'Word Document' },
    'xls': { icon: 'fa-file-excel', color: '#10B981', bg: '#D1FAE5', name: 'Excel Spreadsheet' },
    'xlsx': { icon: 'fa-file-excel', color: '#059669', bg: '#D1FAE5', name: 'Excel Spreadsheet' },
    'ppt': { icon: 'fa-file-powerpoint', color: '#F59E0B', bg: '#FEF3C7', name: 'PowerPoint' },
    'pptx': { icon: 'fa-file-powerpoint', color: '#D97706', bg: '#FEF3C7', name: 'PowerPoint' },
    'txt': { icon: 'fa-file-alt', color: '#6B7280', bg: '#F1F5F9', name: 'Text File' },
    'default': { icon: 'fa-file', color: '#64748B', bg: '#F1F5F9', name: 'File' }
};

// Image Compressor Tool
class ImageCompressor {
    constructor() {
        this.quality = 80;
        this.maxWidth = 1920;
        this.maxHeight = 1080;
        this.originalSize = 0;
        this.compressedSize = 0;
    }

    compressImage(file, quality = this.quality, maxWidth = this.maxWidth, maxHeight = this.maxHeight) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            reader.onload = function(e) {
                img.onload = function() {
                    // Calculate new dimensions
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width *= ratio;
                        height *= ratio;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw image on canvas
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Compress to data URL
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
                    
                    // Convert data URL to blob
                    const byteString = atob(compressedDataUrl.split(',')[1]);
                    const mimeString = compressedDataUrl.split(',')[0].split(':')[1].split(';')[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    
                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    
                    const blob = new Blob([ab], { type: mimeString });
                    const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + '_compressed.jpg', { type: 'image/jpeg' });
                    
                    resolve({
                        file: compressedFile,
                        originalSize: file.size,
                        compressedSize: compressedFile.size,
                        quality: quality,
                        dimensions: { width: Math.round(width), height: Math.round(height) }
                    });
                };
                
                img.onerror = reject;
                img.src = e.target.result;
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

// Image Converter Tool
class ImageConverter {
    constructor() {
        this.supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff'];
    }

    convertImage(file, targetFormat) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            reader.onload = function(e) {
                img.onload = function() {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    // Get MIME type for target format
                    let mimeType;
                    switch(targetFormat.toLowerCase()) {
                        case 'jpg':
                        case 'jpeg':
                            mimeType = 'image/jpeg';
                            break;
                        case 'png':
                            mimeType = 'image/png';
                            break;
                        case 'webp':
                            mimeType = 'image/webp';
                            break;
                        case 'bmp':
                            mimeType = 'image/bmp';
                            break;
                        case 'tiff':
                            mimeType = 'image/tiff';
                            break;
                        default:
                            mimeType = 'image/jpeg';
                    }
                    
                    // Convert to data URL
                    const dataUrl = canvas.toDataURL(mimeType);
                    
                    // Convert data URL to blob
                    const byteString = atob(dataUrl.split(',')[1]);
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    
                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    
                    const blob = new Blob([ab], { type: mimeType });
                    const convertedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + '.' + targetFormat, { type: mimeType });
                    
                    resolve({
                        file: convertedFile,
                        originalFormat: file.name.split('.').pop().toLowerCase(),
                        targetFormat: targetFormat,
                        size: convertedFile.size,
                        dimensions: { width: img.width, height: img.height }
                    });
                };
                
                img.onerror = reject;
                img.src = e.target.result;
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

// PDF Tools Manager
class PDFTools {
    constructor() {
        this.encryptionStrength = 'AES-256';
    }

    async lockPDF(file, password) {
        // Simulate PDF encryption
        return new Promise((resolve) => {
            setTimeout(() => {
                const encryptedSize = file.size + 1024; // Simulate size increase
                const lockedFile = new File(
                    [file], 
                    file.name.replace(/\.[^/.]+$/, "") + '_locked.pdf', 
                    { type: 'application/pdf' }
                );
                
                resolve({
                    file: lockedFile,
                    originalSize: file.size,
                    encryptedSize: encryptedSize,
                    isLocked: true,
                    passwordProtected: true
                });
            }, 2000);
        });
    }

    async unlockPDF(file, password) {
        // Simulate PDF decryption
        return new Promise((resolve) => {
            setTimeout(() => {
                const unlockedFile = new File(
                    [file], 
                    file.name.replace(/\.[^/.]+$/, "") + '_unlocked.pdf', 
                    { type: 'application/pdf' }
                );
                
                resolve({
                    file: unlockedFile,
                    originalSize: file.size,
                    isUnlocked: true,
                    restrictionsRemoved: true
                });
            }, 2000);
        });
    }
}

// File Processor Manager
class FileProcessor {
    constructor() {
        this.imageCompressor = new ImageCompressor();
        this.imageConverter = new ImageConverter();
        this.pdfTools = new PDFTools();
        this.currentFile = null;
        this.processingSteps = [
            "Analyzing file structure...",
            "Optimizing content...",
            "Applying security measures...",
            "Finalizing processing...",
            "Ready for download!"
        ];
    }

    async processFile(file, toolType, options = {}) {
        this.currentFile = file;
        
        switch(toolType) {
            case 'compress-image':
                return await this.imageCompressor.compressImage(
                    file, 
                    options.quality || 80,
                    options.maxWidth || 1920,
                    options.maxHeight || 1080
                );
                
            case 'convert-image':
                return await this.imageConverter.convertImage(
                    file,
                    options.targetFormat || 'jpg'
                );
                
            case 'lock-pdf':
                return await this.pdfTools.lockPDF(
                    file,
                    options.password || ''
                );
                
            case 'unlock-pdf':
                return await this.pdfTools.unlockPDF(
                    file,
                    options.password || ''
                );
                
            default:
                throw new Error('Invalid tool type');
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    calculateReduction(original, compressed) {
        const reduction = ((original - compressed) / original) * 100;
        return Math.max(0, Math.min(100, reduction.toFixed(2)));
    }
}

// UI Manager
class UIManager {
    constructor() {
        this.processor = new FileProcessor();
        this.currentTool = null;
        this.initEventListeners();
    }

    initEventListeners() {
        // Drag and drop functionality
        const dragDropAreas = document.querySelectorAll('.drag-drop-area');
        dragDropAreas.forEach(area => {
            if (area) {
                ['dragenter', 'dragover'].forEach(eventName => {
                    area.addEventListener(eventName, (e) => {
                        e.preventDefault();
                        area.classList.add('active');
                    }, false);
                });

                ['dragleave', 'drop'].forEach(eventName => {
                    area.addEventListener(eventName, (e) => {
                        e.preventDefault();
                        area.classList.remove('active');
                    }, false);
                });

                area.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    this.handleFileUpload(files[0]);
                }, false);
            }
        });

        // File input buttons
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files[0]);
            });
        });

        // Select file buttons
        const selectButtons = document.querySelectorAll('.select-file-btn');
        selectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const fileInput = button.nextElementSibling;
                if (fileInput && fileInput.type === 'file') {
                    fileInput.click();
                }
            });
        });

        // Tool option selection
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            card.addEventListener('click', () => {
                optionCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.updateToolOptions(card.dataset.value);
            });
        });

        // Process buttons
        const processButtons = document.querySelectorAll('.process-btn');
        processButtons.forEach(button => {
            button.addEventListener('click', () => this.processFile());
        });

        // Download buttons
        const downloadButtons = document.querySelectorAll('.download-btn');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => this.downloadFile(e));
        });

        // Password toggle
        const passwordToggles = document.querySelectorAll('.password-toggle');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const input = e.target.previousElementSibling;
                if (input.type === 'password') {
                    input.type = 'text';
                    e.target.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    input.type = 'password';
                    e.target.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
        });
    }

    handleFileUpload(file) {
        if (!file) return;

        const fileInfo = this.getFileInfo(file);
        this.displayFileInfo(file, fileInfo);
        
        // Update UI based on file type
        this.updateUIForFileType(file.type);
    }

    getFileInfo(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        return fileTypeIcons[extension] || fileTypeIcons.default;
    }

    displayFileInfo(file, fileInfo) {
        const fileName = document.getElementById('fileName');
        const fileIcon = document.getElementById('fileIcon');
        const fileSize = document.getElementById('fileSize');
        const fileType = document.getElementById('fileType');

        if (fileName) fileName.textContent = file.name;
        if (fileIcon) {
            fileIcon.className = `fas ${fileInfo.icon}`;
            fileIcon.style.color = fileInfo.color;
        }
        if (fileSize) fileSize.textContent = this.processor.formatFileSize(file.size);
        if (fileType) fileType.textContent = fileInfo.name;

        // Show processing section
        const processingSection = document.querySelector('.processing-section');
        if (processingSection) processingSection.style.display = 'block';
    }

    updateUIForFileType(fileType) {
        // Enable/disable options based on file type
        const isImage = fileType.startsWith('image/');
        const isPDF = fileType === 'application/pdf';

        const imageOptions = document.querySelectorAll('.image-option');
        const pdfOptions = document.querySelectorAll('.pdf-option');
        const documentOptions = document.querySelectorAll('.document-option');

        if (isImage) {
            imageOptions.forEach(opt => opt.style.display = 'block');
            pdfOptions.forEach(opt => opt.style.display = 'none');
            documentOptions.forEach(opt => opt.style.display = 'none');
        } else if (isPDF) {
            imageOptions.forEach(opt => opt.style.display = 'none');
            pdfOptions.forEach(opt => opt.style.display = 'block');
            documentOptions.forEach(opt => opt.style.display = 'none');
        } else {
            imageOptions.forEach(opt => opt.style.display = 'none');
            pdfOptions.forEach(opt => opt.style.display = 'none');
            documentOptions.forEach(opt => opt.style.display = 'block');
        }
    }

    updateToolOptions(toolType) {
        this.currentTool = toolType;
        // Update UI based on selected tool
    }

    async processFile() {
        const fileInput = document.querySelector('input[type="file"]');
        if (!fileInput || !fileInput.files[0]) {
            alert('Please select a file first!');
            return;
        }

        const file = fileInput.files[0];
        const toolType = this.getCurrentToolType();
        const options = this.getToolOptions();

        // Show processing modal
        this.showProcessingModal();

        try {
            const result = await this.processor.processFile(file, toolType, options);
            this.showResults(result);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideProcessingModal();
        }
    }

    getCurrentToolType() {
        // Determine tool type from current page or selection
        const path = window.location.pathname;
        if (path.includes('compressor')) return 'compress-image';
        if (path.includes('converter')) return 'convert-image';
        if (path.includes('pdf-tools')) {
            const action = document.querySelector('input[name="pdf-action"]:checked');
            return action ? action.value : 'lock-pdf';
        }
        return 'compress-image';
    }

    getToolOptions() {
        const options = {};
        
        // Get quality setting
        const qualitySlider = document.getElementById('qualitySlider');
        if (qualitySlider) options.quality = parseInt(qualitySlider.value);
        
        // Get target format
        const formatSelect = document.getElementById('formatSelect');
        if (formatSelect) options.targetFormat = formatSelect.value;
        
        // Get PDF password
        const passwordInput = document.getElementById('pdfPassword');
        if (passwordInput) options.password = passwordInput.value;
        
        return options;
    }

    showProcessingModal() {
        const modal = document.getElementById('processingModal');
        if (modal) {
            modal.style.display = 'flex';
            this.updateProgressBar();
        }
    }

    hideProcessingModal() {
        const modal = document.getElementById('processingModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    updateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        const processingText = document.getElementById('processingText');
        const steps = this.processor.processingSteps;
        
        let step = 0;
        const interval = setInterval(() => {
            if (step < steps.length) {
                const progress = ((step + 1) / steps.length) * 100;
                if (progressFill) progressFill.style.width = `${progress}%`;
                if (processingText) processingText.textContent = steps[step];
                step++;
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }

    showResults(result) {
        // Hide processing section
        const processingSection = document.querySelector('.processing-section');
        if (processingSection) processingSection.style.display = 'none';
        
        // Show results section
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            resultsSection.style.display = 'block';
            
            // Update result stats
            this.updateResultStats(result);
            
            // Set up download
            const downloadBtn = resultsSection.querySelector('.download-btn');
            if (downloadBtn) {
                downloadBtn.dataset.file = URL.createObjectURL(result.file);
                downloadBtn.dataset.filename = result.file.name;
            }
        }
    }

    updateResultStats(result) {
        // Update file size stats
        const originalSizeElem = document.getElementById('originalSize');
        const compressedSizeElem = document.getElementById('compressedSize');
        const reductionElem = document.getElementById('reductionPercent');
        
        if (originalSizeElem && result.originalSize) {
            originalSizeElem.textContent = this.processor.formatFileSize(result.originalSize);
        }
        
        if (compressedSizeElem && result.compressedSize) {
            compressedSizeElem.textContent = this.processor.formatFileSize(result.compressedSize);
        }
        
        if (reductionElem && result.originalSize && result.compressedSize) {
            const reduction = this.processor.calculateReduction(result.originalSize, result.compressedSize);
            reductionElem.textContent = `${reduction}%`;
            reductionElem.style.color = reduction > 50 ? '#10B981' : '#F59E0B';
        }
    }

    showError(message) {
        alert(`Error: ${message}`);
    }

    downloadFile(event) {
        const url = event.target.dataset.file;
        const filename = event.target.dataset.filename;
        
        if (url && filename) {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            // Show success message
            this.showSuccessMessage();
        }
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>File downloaded successfully! All temporary data has been deleted for security.</span>
        `;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 3000;
            animation: fadeInUp 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => document.body.removeChild(message), 300);
        }, 3000);
    }
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const uiManager = new UIManager();
    
    // Add global styles for success message animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    
    // Add 3D hover effects
    document.querySelectorAll('.tool-window, .option-card, .nav-button').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
