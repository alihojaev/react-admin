import { Http, PublicHttp } from "../http";

const c = new Http()
const pc = new PublicHttp()

export class AuthApi {

  get cli() {
    return c
  }

  admin = {

    block(id: string) {
      return c.post(`/api/user/block?id=${id}`)
    },

    current() {
      return c.get(`/api/user/current`)
    },

    delete(id: string) {
      return c.delete(`/api/user?id=${id}`)
    },

    getUserById(id: string) {
      return c.get(`/api/user/byId?id=${id}`)
    },

    getUsers(query: string, page?: number, size?: number, sort?: string) {
      return c.get(`/api/user?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    save(body: any) {
      return c.post(`/api/user`, body)
    },

    updatePassword(body: any) {
      return c.put(`/api/user/password`, body)
    }
  }

  entityFields = {

    getAvailableEntities() {
      return c.get(`/api/entityFields/entities`)
    },

    getEntityFields(entityName: string) {
      return c.get(`/api/entityFields/entities/${entityName}/fields`)
    }
  }

  example = {

    delete(id: string) {
      return c.delete(`/api/example/${id}`)
    },

    downloadReport(body: any) {
      return c.post(`/api/example/download`, body)
    },

    generateReport(body: any) {
      return c.post(`/api/example/generate`, body)
    },

    getById(id: string) {
      return c.get(`/api/example/${id}`)
    },

    getFields() {
      return c.get(`/api/example/fields`)
    },

    listAll(query: string, page?: number, size?: number, sort?: string) {
      return c.get(`/api/example?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    save(body: any) {
      return c.post(`/api/example`, body)
    },

    update(id: string, body: any) {
      return c.put(`/api/example/${id}`, body)
    }
  }

  menu = {

    menu() {
      return c.get(`/api/menu`)
    }
  }

  permission = {

    list() {
      return c.get(`/api/permission`)
    }
  }

  role = {

    delete(roleId: string) {
      return c.delete(`/api/role?roleId=${roleId}`)
    },

    findAllRsql(query: string, page?: number, size?: number, sort?: string) {
      return c.get(`/api/role/rsql?query=${query}&page=${page ? page : 0}&size=${size ? size : 10}&sort=${sort ? sort : 'cdt,desc'}`)
    },

    list() {
      return c.get(`/api/role`)
    },

    listPermissions() {
      return c.get(`/api/role/permissions`)
    },

    listRoleWithUnit() {
      return c.get(`/api/role/unit`)
    },

    save(body: any) {
      return c.post(`/api/role`, body)
    }
  }
}

export class P_Api {
  auth = {

    login(body: any) {
      return pc.post(`/api/public/auth/login`, body)
    }
  }
}
