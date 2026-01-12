export default {
  name: 'product',
  title: 'Dresses',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Dress Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    // ✅ KEEP THIS: It will act as the "Display Price" or "Starting At" price
    {
      name: 'price',
      title: 'Display Price (Starting From)',
      type: 'number',
    },
    // ✅ NEW FIELD: A list where you can add specific sizes and their prices
    {
      name: 'sizeOptions',
      title: 'Sizes & Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'size', title: 'Size Label', type: 'string' }, // e.g., "3-4 Years"
            { name: 'price', title: 'Price for this Size', type: 'number' } // e.g., 1600
          ]
        }
      ]
    },
    {
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    // Add this INSIDE the fields array, maybe after the main 'image' field
    {
      name: 'gallery',
      title: 'Extra Images (Gallery)',
      type: 'array',
      of: [{ type: 'image' }], // This allows you to add a list of images
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Party Wear', value: 'party' },
          { title: 'Casual', value: 'casual' },
          { title: 'Accessories', value: 'accessories' },
        ],
      },
    },
  ],
}