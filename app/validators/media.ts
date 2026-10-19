import vine from '@vinejs/vine'

export const mediaUploadValidator = vine.create({
  image: vine.file({ size: '5mb', extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif'] }),
  altText: vine.string().trim().optional(),
})

export const mediaUpdateValidator = vine.create({
  filename: vine.string().trim().minLength(1),
  altText: vine.string().trim().optional(),
})
