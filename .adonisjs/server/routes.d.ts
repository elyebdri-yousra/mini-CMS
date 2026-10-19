import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin_dashboard': { paramsTuple?: []; params?: {} }
    'admin_pages.index': { paramsTuple?: []; params?: {} }
    'admin_pages.create': { paramsTuple?: []; params?: {} }
    'admin_pages.store': { paramsTuple?: []; params?: {} }
    'admin_pages.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_pages.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_pages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_pages.togglePublish': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.index': { paramsTuple?: []; params?: {} }
    'admin_media.store': { paramsTuple?: []; params?: {} }
    'admin_media.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pages.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin_dashboard': { paramsTuple?: []; params?: {} }
    'admin_pages.index': { paramsTuple?: []; params?: {} }
    'admin_pages.create': { paramsTuple?: []; params?: {} }
    'admin_pages.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.index': { paramsTuple?: []; params?: {} }
    'pages.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin_dashboard': { paramsTuple?: []; params?: {} }
    'admin_pages.index': { paramsTuple?: []; params?: {} }
    'admin_pages.create': { paramsTuple?: []; params?: {} }
    'admin_pages.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.index': { paramsTuple?: []; params?: {} }
    'pages.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  POST: {
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin_pages.store': { paramsTuple?: []; params?: {} }
    'admin_media.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'admin_pages.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'admin_pages.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_media.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'admin_pages.togglePublish': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}