function prepareMetadata(metadata, format) {
  switch (format) {
    case ".jpg":
    case ".jpeg":
      return {
        "IPTC:ObjectName": metadata.title,
        "IPTC:Caption-Abstract": metadata.description,
        "IPTC:Keywords": metadata.keywords,
        "XMP:Title": metadata.title,
        "XMP:Description": metadata.description,
        "XMP:Subject": metadata.keywords,
        "EXIF:ImageDescription": metadata.description,
        "EXIF:XPTitle": metadata.title,
        "EXIF:XPKeywords": metadata.keywords
          ? metadata.keywords.join(";")
          : undefined,
      };

    case ".png":
      return {
        "PNG:Title": metadata.title,
        "PNG:Description": metadata.description,
        "XMP:Title": metadata.title,
        "XMP:Description": metadata.description,
        Description: metadata.description,
        "XMP:Subject": metadata.keywords,
        "XMP-dc:Subject": metadata.keywords,
        Keywords: metadata.keywords,
      };

    case ".webp":
      return {
        "XMP:Title": metadata.title,
        "XMP:Description": metadata.description,
        "XMP:Subject": metadata.keywords,
      };

    case ".tiff":
      return {
        "TIFF:ImageDescription": metadata.description,
        "TIFF:DocumentName": metadata.title,
        "XMP:Title": metadata.title,
        "XMP:Description": metadata.description,
        "XMP:Subject": metadata.keywords,
      };

    default:
      return {
        Title: metadata.title,
        Description: metadata.description,
        Keywords: metadata.keywords,
      };
  }
}

module.exports = { prepareMetadata };
