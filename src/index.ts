import lunr, { Index, Query } from 'lunr'
import franchisee from './data/franchisee.json'

type FranchiseSearch = (element: HTMLElement) => void

declare global {
  interface Window {
    __franchiseSearch?: FranchiseSearch
  }
}

window.__franchiseSearch = (element) => {
  const autocomplete: HTMLDivElement = document.createElement('div')
  autocomplete.className = 'franchise-search_autocomplete'

  const specialist: HTMLDivElement = document.createElement('div')
  specialist.className = 'franchise-search_specialist'

  const index = lunr((search) => {
    search.field('names')
    search.field('zones')
    search.ref('title')
    franchisee.forEach((entry) => {
      search.add(entry)
    })
  })

  const handleResultSelect = ({ currentTarget }: MouseEvent) => {
    const { dataset } = <HTMLInputElement>currentTarget
    const { title, profile_img, area, affiliate_code } = franchisee.find(
      ({ title }: { title: string }) => title === dataset.ref
    )

    autocomplete.style.display = 'none'
    autocomplete.innerHTML = ''
    specialist.innerHTML = `
      <img alt="GoCruise ${title}" src="${profile_img}">
      <h3>${title}</h3>
      <p>${area}</p>
      <a href="//www.gocruise.co.uk?aff=${affiliate_code}" title="Select specialist">Select specialist</a>
    `
  }

  const makeSuggestion = (ref: string): HTMLLIElement => {
    const li: HTMLLIElement = document.createElement('li')
    li.className = 'franchise-search_result-item'
    li.dataset.ref = ref
    li.innerText = ref
    li.addEventListener('click', handleResultSelect)

    return li
  }

  const handleSearchInput = ({ currentTarget }: KeyboardEvent): void => {
    const { value } = <HTMLInputElement>currentTarget

    autocomplete.style.display = 'none'
    autocomplete.innerHTML = ''

    if (value.length >= 2) {
      const matches: Index.Result[] = index.query((query) => {
        query.term(value.toLowerCase().split(/\s/), {
          editDistance: 1,
          presence: Query.presence.OPTIONAL,
          wildcard: Query.wildcard.TRAILING
        })
      })

      const ul: HTMLUListElement = document.createElement('ul')
      ul.className = 'franchise-search_result-list'

      matches.forEach(({ ref }: { ref: string }) => ul.appendChild(makeSuggestion(ref)))
      autocomplete.appendChild(ul)
      autocomplete.style.display = 'block'
    }
  }

  element.parentNode.insertBefore(specialist, element.nextSibling)
  element.parentNode.insertBefore(autocomplete, element.nextSibling)
  element.addEventListener('keyup', handleSearchInput)
}
