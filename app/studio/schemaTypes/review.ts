// sanity/schemaTypes/review.ts
import { Star } from "lucide-react"; // Optional icon

export default {
  name: 'review',
  title: 'Review',
  type: 'document',
  // Optional: Visual icon in Studio
  // icon: Star, 
  fields: [
    {
      name: 'name',
      title: 'Reviewer Name',
      type: 'string',
    },
    {
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1).max(5),
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'text',
    },
    {
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
    },
    {
      name: 'images',
      title: 'Review Images',
      type: 'array',
      of: [{ type: 'image' }],
    },
  ],
};