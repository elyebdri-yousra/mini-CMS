import { BaseSeeder } from '@adonisjs/lucid/seeders'
import env from '#start/env'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // updateOrCreate pour pouvoir relancer le seeder sans dupliquer le compte
    await User.updateOrCreate(
      { email: env.get('ADMIN_EMAIL') },
      {
        email: env.get('ADMIN_EMAIL'),
        password: env.get('ADMIN_PASSWORD'),
        fullName: 'Administrateur',
        role: 'admin',
      }
    )
  }
}
