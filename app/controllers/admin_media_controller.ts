import type { HttpContext } from '@adonisjs/core/http'
import Media from '#models/media'
import { mediaUploadValidator, mediaUpdateValidator } from '#validators/media'
import Page from '#models/page'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import { unlink } from 'node:fs/promises'

export default class AdminMediaController {
  async index({ view }: HttpContext) {
    const media = await Media.query().orderBy('createdAt', 'desc')
    return view.render('pages/admin/media/index', { media })
  }

  async store({ request, response, session }: HttpContext) {
    const { image, altText } = await request.validateUsing(mediaUploadValidator)

    // nom unique sur le disque, le nom d'origine reste modifiable côté admin
    const diskName = `${randomUUID()}.${image.extname}`
    await image.move(app.publicPath('uploads'), { name: diskName })

    await Media.create({
      filename: image.clientName,
      path: `/uploads/${diskName}`,
      altText: altText || null,
    })

    session.flash('success', 'Image importée.')
    response.redirect().toRoute('admin_media.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const media = await Media.findOrFail(params.id)
    const data = await request.validateUsing(mediaUpdateValidator)

    media.merge({ filename: data.filename, altText: data.altText || null })
    await media.save()

    session.flash('success', 'Image mise à jour.')
    response.redirect().toRoute('admin_media.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const media = await Media.findOrFail(params.id)

    // sqlite n'applique pas ON DELETE SET NULL par défaut, on le fait nous-mêmes
    await Page.query().where('coverMediaId', media.id).update({ coverMediaId: null })

    try {
      await unlink(app.publicPath(media.path.replace(/^\//, '')))
    } catch {
      // le fichier est déjà absent du disque, on supprime quand même l'enregistrement
    }
    await media.delete()

    session.flash('success', 'Image supprimée.')
    response.redirect().toRoute('admin_media.index')
  }
}
