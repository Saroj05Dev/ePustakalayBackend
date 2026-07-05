const https = require('https');
const http = require('http');

/**
 * Extract text from PDF URL using pdf-parse library
 * Install: npm install pdf-parse
 * 
 * @param {string} pdfUrl - URL of the PDF file (e.g., from Cloudinary)
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromPDF(pdfUrl) {
    try {
        // Dynamically import pdf-parse (requires installation)
        const pdfParse = require('pdf-parse');
        
        // Download PDF buffer from URL
        const pdfBuffer = await downloadPDF(pdfUrl);
        
        // Extract text
        const data = await pdfParse(pdfBuffer);
        
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error.message);
        throw new Error(`PDF text extraction failed: ${error.message}`);
    }
}

/**
 * Download PDF file from URL and return as buffer
 * @param {string} url - PDF URL
 * @returns {Promise<Buffer>}
 */
function downloadPDF(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        protocol.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download PDF: ${response.statusCode}`));
                return;
            }
            
            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        }).on('error', reject);
    });
}

/**
 * Extract text from specific page range
 * Note: This is a basic implementation. For precise page extraction,
 * consider using libraries like pdf-lib or pdfjs-dist
 * 
 * @param {string} pdfUrl - URL of the PDF
 * @param {number} startPage - Starting page (1-indexed)
 * @param {number} endPage - Ending page (1-indexed)
 * @returns {Promise<string>} - Extracted text from specified pages
 */
async function extractTextFromPages(pdfUrl, startPage, endPage) {
    try {
        const pdfParse = require('pdf-parse');
        const pdfBuffer = await downloadPDF(pdfUrl);
        
        // pdf-parse options to extract specific pages
        const options = {
            // This is approximate - full page-by-page extraction needs more complex logic
            max: endPage,
        };
        
        const data = await pdfParse(pdfBuffer, options);
        
        // Note: pdf-parse doesn't provide perfect page-by-page separation
        // For production, consider using pdfjs-dist or pdf-lib for precise extraction
        return data.text;
    } catch (error) {
        console.error('Error extracting pages:', error.message);
        throw new Error(`Page extraction failed: ${error.message}`);
    }
}

/**
 * Split PDF text into chapters (basic heuristic)
 * Looks for common chapter patterns like "Chapter 1", "CHAPTER ONE", etc.
 * 
 * @param {string} text - Full PDF text
 * @returns {Array<Object>} - Array of chapter objects with title and content
 */
function splitIntoChapters(text) {
    // Common chapter patterns
    const chapterRegex = /(?:^|\n)(Chapter\s+\d+|CHAPTER\s+\d+|Ch\.\s*\d+)[\s:—-]+([^\n]+)/gi;
    
    const chapters = [];
    let lastIndex = 0;
    let match;
    let chapterNum = 0;
    
    while ((match = chapterRegex.exec(text)) !== null) {
        // Save previous chapter content
        if (chapterNum > 0) {
            chapters[chapterNum - 1].content = text.substring(lastIndex, match.index).trim();
        }
        
        chapterNum++;
        chapters.push({
            chapter_number: chapterNum,
            chapter_title: match[2].trim(),
            content: '',
        });
        
        lastIndex = match.index + match[0].length;
    }
    
    // Add content for last chapter
    if (chapters.length > 0) {
        chapters[chapters.length - 1].content = text.substring(lastIndex).trim();
    }
    
    return chapters;
}

module.exports = {
    extractTextFromPDF,
    extractTextFromPages,
    splitIntoChapters,
    downloadPDF,
};
