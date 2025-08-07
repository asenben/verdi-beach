const GalleryAPI = {
  getAll: () => {
    const sortedItems = [...galleryDatabase].sort((a, b) => {
      const getItemNumber = (item) => {
        if (item.src && item.src.includes("gallery/")) {
          const match = item.src.match(/gallery\/(\d+)\.jpg/);
          return match ? parseInt(match[1]) : 0;
        } else if (item.images && item.images[0] && item.images[0].src) {
          const match = item.images[0].src.match(/gallery\/(\d+)\.jpg/);
          return match ? parseInt(match[1]) : 0;
        } else if (item.src && item.src.includes("video/")) {
          if (item.src.includes("event_1")) return 6;
          if (item.src.includes("event_2")) return 19;
          if (item.src.includes("qr_code")) return 9;
          return 0;
        }
        return 0;
      };

      return getItemNumber(b) - getItemNumber(a);
    });

    return sortedItems;
  },
  getByCategory: (category) =>
    galleryDatabase.filter((item) => item.category === category),
  getByType: (type) => galleryDatabase.filter((item) => item.type === type),
  getItems: (startIndex, count) =>
    galleryDatabase.slice(startIndex, startIndex + count),
  getCount: () => galleryDatabase.length,

  addNew: (newItem) => {
    galleryDatabase.unshift(newItem);
  },

  addNewImage: (imagePath, title, category = "beach", alt = null) => {
    const maxNumber = Math.max(
      ...galleryDatabase
        .filter((item) => item.src && item.src.includes("gallery/"))
        .map((item) => {
          const match = item.src.match(/gallery\/(\d+)\.jpg/);
          return match ? parseInt(match[1]) : 0;
        })
    );

    const newNumber = maxNumber + 1;
    const newImagePath = `assets/img/gallery/${newNumber}.jpg`;

    const singleImageItem = {
      type: "single-image",
      category: category,
      title: title,
      images: [
        {
          src: newImagePath,
          alt: alt || title,
        },
      ],
    };

    const imageItem = {
      type: "image",
      src: newImagePath,
      alt: alt || title,
      category: category,
      title: title,
    };

    galleryDatabase.unshift(singleImageItem, imageItem);

    return {
      imageNumber: newNumber,
      imagePath: newImagePath,
      message: `Добавена нова снимка ${newNumber}.jpg - "${title}"`,
    };
  },
};
