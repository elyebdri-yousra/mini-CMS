import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class AdminUsersController {
  async index({ view }: HttpContext) {
    const users = await User.query().orderBy('fullName', 'asc')
    return view.render('pages/admin/users/index', { users })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/admin/users/create')
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)
    await User.create(data)

    session.flash('success', 'Utilisateur créé avec succès.')
    response.redirect().toRoute('admin_users.index')
  }

  async edit({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('pages/admin/users/edit', { user })
  }

  async update({ params, request, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)

    const payload = request.only(['fullName', 'email', 'password', 'role'])
    if (!payload.password) delete payload.password
    const data = await request.validateUsing(updateUserValidator, {
      data: payload,
      meta: { userId: user.id },
    })

    user.merge({ fullName: data.fullName, email: data.email, role: data.role })
    if (data.password) {
      user.password = data.password
    }
    await user.save()

    session.flash('success', 'Utilisateur mis à jour avec succès.')
    response.redirect().toRoute('admin_users.index')
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (user.id === auth.user!.id) {
      session.flash('error', 'Vous ne pouvez pas supprimer votre propre compte.')
      return response.redirect().toRoute('admin_users.index')
    }

    if (user.role === 'admin') {
      const adminCount = await User.query().where('role', 'admin').count('* as total').first()
      if (Number(adminCount?.$extras.total) <= 1) {
        session.flash('error', "Impossible de supprimer le dernier compte administrateur.")
        return response.redirect().toRoute('admin_users.index')
      }
    }

    await user.delete()
    session.flash('success', 'Utilisateur supprimé.')
    response.redirect().toRoute('admin_users.index')
  }
}
