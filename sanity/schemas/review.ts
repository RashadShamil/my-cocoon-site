// schemas/review.ts
export default {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'User Name',
      type: 'string',
    },
    {
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule: any) => Rule.min(1).max(5),
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'text',
    },
    {
      name: 'images',
      title: 'User Images',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
    }
  ]
}