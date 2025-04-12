# GenMeta - User Guides

This document provides comprehensive guides on how to use GenMeta, an Electron-based desktop application that generates metadata for images using AI.

## Table of Contents

- [Getting Started](#getting-started)
- [Basic Usage](#basic-usage)
- [API Key Configuration](#api-key-configuration)
- [Advanced Settings](#advanced-settings)
- [Batch Processing](#batch-processing)
- [Exporting and Saving](#exporting-and-saving)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Installation

1. Download the appropriate installer for your operating system from the [Releases page](https://github.com/aminurjs/genmeta-app/releases):

   - Windows: `.exe` installer
   - macOS: `.dmg` file
   - Linux: `.AppImage` file

2. Install the application:

   - **Windows**: Run the installer and follow the wizard
   - **macOS**: Open the DMG and drag to Applications folder
   - **Linux**: Make the AppImage executable (`chmod +x GenMeta-x.x.x.AppImage`) and run it

3. Launch GenMeta from your applications menu or desktop shortcut

## Basic Usage

### Processing Your First Images

1. Click the **Browse** button in the top navigation bar
2. Select a directory containing the images you want to process
3. Once selected, you'll see the count of compatible images found
4. Click the **Generate** button to begin processing
5. A progress bar will appear showing the status of the operation

### Understanding the Results

After processing, the results will display:

- Summary statistics (Total, Successful, Failed)
- Individual image cards showing:
  - Image thumbnail
  - Generated title and description
  - Keywords
  - Status (Success/Error)

## API Key Configuration

GenMeta uses Google's Gemini AI to generate metadata. You need to set up your API key:

1. Click the **Settings** button in the top right
2. Enter your Gemini API key
3. Click **Save**

### Obtaining a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create or sign in to your Google account
3. Navigate to the API keys section
4. Create a new API key
5. Copy the key and paste it into GenMeta's settings

## Advanced Settings

### Customizing Metadata Generation

In the Settings dialog, you can customize:

1. **Title Length**: Adjust the slider to set preferred title length (40-200 characters)
2. **Description Length**: Adjust the slider to set preferred description length
3. **Keywords Count**: Control how many keywords are generated per image

### Output Preferences

You can configure:

- Output directory for processed files
- Whether to overwrite existing metadata
- CSV export settings

## Batch Processing

### Processing Large Collections

GenMeta handles batch processing efficiently:

1. Select a directory with multiple images
2. Click **Generate**
3. The application will process images sequentially with progress tracking
4. You can cancel processing at any time by clicking the **Cancel** button

### Performance Considerations

- Processing time depends on image count and internet connection speed
- The application uses concurrency limiting to avoid API rate limits
- For very large collections (100+ images), consider processing in smaller batches

## Exporting and Saving

### Saving Metadata to Images

1. After processing, review the generated metadata
2. Make any necessary edits by clicking on fields
3. Click **Save All Changes** to write metadata to the image files

### Exporting to CSV

1. After processing, click the **Export CSV** button
2. Choose a location to save the CSV file
3. All metadata (title, description, keywords) will be included in the export

### Adding Common Keywords

To add a keyword to all processed images:

1. Click the **Add Keyword** button
2. Enter the keyword in the dialog
3. The keyword will be added to all successful results

## Troubleshooting

### Common Issues

#### API Key Issues

- Ensure your API key is valid and hasn't expired
- Check your internet connection
- Verify the API key is entered correctly with no extra spaces

#### Processing Errors

- Unsupported file formats: Ensure images are in JPG, PNG, or other standard formats
- Corrupt images: Try reprocessing problem files individually
- API rate limiting: Wait a few minutes and try again with fewer images

#### Application Crashes

- Update to the latest version of the application
- Restart the application
- Check system resources (memory, disk space)

### Getting Help

If you encounter issues not covered in this guide:

1. Check the GitHub repository for known issues
2. Open a new issue with detailed information about your problem
3. Include logs if possible (found in the app's data directory)

---

For more information and updates, visit the [GenMeta GitHub repository](https://github.com/aminurjs/genmeta-app).
