/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', [controllers.PublicPages, 'index']).as('home')

router
  .group(() => {
    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
    router.get('admin', [controllers.AdminDashboard, 'index']).as('admin_dashboard')

    router
      .group(() => {
        router.get('/', [controllers.AdminPages, 'index']).as('index')
        router.get('create', [controllers.AdminPages, 'create']).as('create')
        router.post('/', [controllers.AdminPages, 'store']).as('store')
        router.get(':id/edit', [controllers.AdminPages, 'edit']).as('edit')
        router.put(':id', [controllers.AdminPages, 'update']).as('update')
        router.delete(':id', [controllers.AdminPages, 'destroy']).as('destroy')
        router.patch(':id/publish', [controllers.AdminPages, 'togglePublish']).as('togglePublish')
      })
      .prefix('admin/pages')
      .as('admin_pages')

    router
      .group(() => {
        router.get('/', [controllers.AdminMedia, 'index']).as('index')
        router.post('/', [controllers.AdminMedia, 'store']).as('store')
        router.put(':id', [controllers.AdminMedia, 'update']).as('update')
        router.delete(':id', [controllers.AdminMedia, 'destroy']).as('destroy')
      })
      .prefix('admin/media')
      .as('admin_media')

    router
      .group(() => {
        router.get('/', [controllers.AdminUsers, 'index']).as('index')
        router.get('create', [controllers.AdminUsers, 'create']).as('create')
        router.post('/', [controllers.AdminUsers, 'store']).as('store')
        router.get(':id/edit', [controllers.AdminUsers, 'edit']).as('edit')
        router.put(':id', [controllers.AdminUsers, 'update']).as('update')
        router.delete(':id', [controllers.AdminUsers, 'destroy']).as('destroy')
      })
      .prefix('admin/users')
      .as('admin_users')
      .use(middleware.adminOnly())
  })
  .use(middleware.auth())

// catch-all pour les pages publiées, enregistrée en dernier pour ne pas
// capturer les routes au-dessus (/login, /admin/pages, ...)
router.get(':slug', [controllers.PublicPages, 'show']).as('pages.show')
