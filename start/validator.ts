/*
|--------------------------------------------------------------------------
| Validator file
|--------------------------------------------------------------------------
|
| The validator file is used for configuring global transforms for VineJS.
| The transform below converts all VineJS date outputs from JavaScript
| Date objects to Luxon DateTime instances, so that validated dates are
| ready to use with Lucid models and other parts of the app that expect
| Luxon DateTime.
|
*/

import { DateTime } from 'luxon'
import vine, { VineDate, SimpleMessagesProvider } from '@vinejs/vine'

declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

VineDate.transform((value) => DateTime.fromJSDate(value))

// messages d'erreur VineJS en français
vine.messagesProvider = new SimpleMessagesProvider(
  {
    required: 'Le champ {{ field }} est obligatoire.',
    string: 'Le champ {{ field }} doit être une chaîne de caractères.',
    email: 'Le champ {{ field }} doit être une adresse email valide.',
    minLength: 'Le champ {{ field }} doit contenir au moins {{ min }} caractères.',
    maxLength: 'Le champ {{ field }} ne doit pas dépasser {{ max }} caractères.',
    regex: 'Le format du champ {{ field }} est invalide.',
    enum: 'La valeur sélectionnée pour {{ field }} est invalide.',
    number: 'Le champ {{ field }} doit être un nombre.',
    'database.unique': 'Cette valeur du champ {{ field }} est déjà utilisée.',
    sameAs: 'Le champ {{ field }} doit être identique au champ {{ otherField }}.',
  },
  {
    title: 'titre',
    slug: 'slug',
    excerpt: 'extrait',
    content: 'contenu',
    status: 'statut',
    menuOrder: 'ordre dans le menu',
    email: 'email',
    password: 'mot de passe',
    passwordConfirmation: 'confirmation du mot de passe',
    fullName: 'nom complet',
  }
)
