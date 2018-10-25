import { observable, action } from 'mobx'
import api from '../config/api'

class UserStore {
  @observable currentUser
  @observable loadingUser
  @observable updatingUser
  @observable updatingUserErrors

  @action pullUser () {
    this.loadingUser = true
    return api.Auth
      .current()
      .then(
        action(({ user }) => {
          this.currentUser = user
        })
      )
      .finally(
        action(() => {
          this.loadingUser = false
        })
      )
  }

  @action updateUser (newUser) {
    this.updatingUser = true
    return api.Auth
      .save(newUser)
      .then(
        action(({ user }) => {
          this.currentUser = user
        })
      )
      .finally(
        action(() => {
          this.updatingUser = false
        })
      )
  }

  @action forgetUser () {
    this.currentUser = undefined
  }
}
const userStore = new UserStore()
export default userStore
