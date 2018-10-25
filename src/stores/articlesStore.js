import { observable, action, computed } from 'mobx'
import api from '../config/api'

const LIMIT = 10

export class ArticlesStore {
  @observable isLoading = false
  @observable page = 0
  @observable totalPagesCount = 0
  @observable articlesRegistry = observable.map()
  @observable predicate = {}

  @computed get articles () {
    return this.articlesRegistry.values()
  }

  clear () {
    this.articlesRegistry.clear()
    this.page = 0
  }

  getArticle (slug) {
    return this.articlesRegistry.get(slug)
  }

  @action setPage (page) {
    this.page = page
  }

  @action setPredicate (predicate) {
    if (JSON.stringify(predicate) === JSON.stringify(this.predicate)) return
    this.clear()
    this.predicate = predicate
  }

  $req () {
    if (this.predicate.myFeed) return api.Articles.feed(this.page, LIMIT)
    if (this.predicate.favoritedBy) {
      return api.Articles.favoritedBy(
        this.predicate.favoritedBy,
        this.page,
        LIMIT
      )
    }
    if (this.predicate.tag) {
      return api.Articles.byTag(this.predicate.tag, this.page, LIMIT)
    }
    if (this.predicate.author) {
      return api.Articles.byAuthor(this.predicate.author, this.page, LIMIT)
    }
    return api.Articles.all(this.page, LIMIT, this.predicate)
  }

  @action loadArticles () {
    this.isLoading = true
    return this.$req()
      .then(
        action(({ articles, articlesCount }) => {
          this.articlesRegistry.clear()
          articles.forEach(article =>
            this.articlesRegistry.set(article.slug, article)
          )
          this.totalPagesCount = Math.ceil(articlesCount / LIMIT)
        })
      )
      .finally(
        action(() => {
          this.isLoading = false
        })
      )
  }

  @action loadArticle (slug, { acceptCached = false } = {}) {
    if (acceptCached) {
      const article = this.getArticle(slug)
      if (article) return Promise.resolve(article)
    }
    this.isLoading = true
    return api.Articles
      .get(slug)
      .then(
        action(({ article }) => {
          this.articlesRegistry.set(article.slug, article)
          return article
        })
      )
      .finally(
        action(() => {
          this.isLoading = false
        })
      )
  }

  @action makeFavorite (slug) {
    const article = this.getArticle(slug)
    if (article && !article.favorited) {
      article.favorited = true
      article.favoritesCount++
      return api.Articles.favorite(slug).catch(
        action(err => {
          article.favorited = false
          article.favoritesCount--
          throw err
        })
      )
    }
    return Promise.resolve()
  }

  @action unmakeFavorite (slug) {
    const article = this.getArticle(slug)
    if (article && article.favorited) {
      article.favorited = false
      article.favoritesCount--
      return api.Articles.unfavorite(slug).catch(
        action(err => {
          article.favorited = true
          article.favoritesCount++
          throw err
        })
      )
    }
    return Promise.resolve()
  }

  @action createArticle (article) {
    return api.Articles.create(article).then(({ article }) => {
      this.articlesRegistry.set(article.slug, article)
      return article
    })
  }

  @action updateArticle (data) {
    return api.Articles.update(data).then(({ article }) => {
      this.articlesRegistry.set(article.slug, article)
      return article
    })
  }

  @action deleteArticle (slug) {
    this.articlesRegistry.delete(slug)
    return api.Articles.del(slug).catch(
      action(err => {
        this.loadArticles()
        throw err
      })
    )
  }
}
const articlesStore = new ArticlesStore()
export default articlesStore
