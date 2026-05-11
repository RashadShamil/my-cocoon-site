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
    {
      name: 'price',
      title: 'Display Price (Starting From)',
      type: 'number',
    },
    {
      name: 'isSale',
      title: 'Is this item on sale?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'originalPrice',
      title: 'Original Price (Before Sale)',
      type: 'number',
      hidden: ({ document }: any) => !document?.isSale,
    },
    {
      name: 'sizeOptions',
      title: 'Sizes & Variants (Legacy)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'size', title: 'Size Label', type: 'string' },
            { name: 'price', title: 'Price for this Size', type: 'number' }
          ]
        }
      ]
    },
    {
      name: 'colors',
      title: 'Color Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'colorName', title: 'Color Name', type: 'string' },
            { name: 'colorHex', title: 'Color Hex Code (Optional)', type: 'string' },
            {
              name: 'image',
              title: 'Color Specific Image',
              type: 'image',
              options: { hotspot: true }
            },
            { 
              name: 'sizes', 
              title: 'Sizes & Stock', 
              type: 'array', 
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'size', title: 'Size Label', type: 'string' },
                    { name: 'price', title: 'Price for this Size', type: 'number' },
                    { name: 'stock', title: 'Stock Available', type: 'number' }
                  ]
                }
              ]
            }
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
    {
      name: 'gallery',
      title: 'Extra Images (Gallery)',
      type: 'array',
      of: [{ type: 'image' }],
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
          { title: 'Casual Dresses', value: 'Casual Dresses' },
          { title: 'Infant Wear', value: 'Infant Wear' },
          { title: 'Party Wear', value: 'Party Wear' },
          { title: 'Girls\' Tops', value: 'Girls\' Tops' },
        ],
      },
    },
  ],
}