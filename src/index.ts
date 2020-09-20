import lunr, { Index, Query } from 'lunr'
import { parse } from 'postcode'
import franchisee from './data/franchisee.json'

type FranchiseSearch = (element: HTMLElement) => void

declare global {
  interface Window {
    __franchiseSearch?: FranchiseSearch
  }
}

window.__franchiseSearch = (element) => {
  const error: HTMLDivElement = document.createElement('div')
  error.className = 'franchise-search_error'

  const autocomplete: HTMLDivElement = document.createElement('div')
  autocomplete.className = 'franchise-search_autocomplete'

  const noResults: HTMLDivElement = document.createElement('div')
  noResults.className = 'franchise-search_noresults'

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

  const resultSelect = ({ currentTarget }: MouseEvent): void => {
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
    li.addEventListener('click', resultSelect)

    return li
  }

  const displaySearchResults = (results: Index.Result[]): void => {
    noResults.innerHTML = ''

    if (results.length) {
      const ul: HTMLUListElement = document.createElement('ul')
      ul.className = 'franchise-search_result-list'
      results.forEach(({ ref }: { ref: string }) => ul.appendChild(makeSuggestion(ref)))
      autocomplete.appendChild(ul)
      autocomplete.style.display = 'block'
    } else {
      noResults.innerHTML = `
        <p>No specialist found, call 0800 121 8250 or make an enquiry to be allocated yours</p>
      `
    }
  }

  const nameSearch = (input: string) => {
    if (input.length >= 2) {
      const results: Index.Result[] = index.query((query) => {
        query.term(input.toLowerCase().split(/\s/), {
          presence: Query.presence.REQUIRED,
          wildcard: Query.wildcard.TRAILING
        })
      })

      displaySearchResults(results)
    }
  }

  const postcodeSearch = (input: string): void => {
    const postcode = parse(input)

    if (postcode.valid) {
      const results: Index.Result[] = index.query((query) => {
        query.term(postcode.sector.toLowerCase(), {
          editDistance: 0
        })
      })

      displaySearchResults(results)
    } else {
      error.style.display = 'block'
      error.innerHTML = 'Please enter a full valid postcode'
    }
  }

  const handleSearchInput = ({ currentTarget }: KeyboardEvent): void => {
    const { value } = <HTMLInputElement>currentTarget

    error.style.display = 'none'
    error.innerHTML = ''

    autocomplete.style.display = 'none'
    autocomplete.innerHTML = ''

    if (/^[a-z]{1,2}\d[a-z\d]?/i.test(value)) {
      postcodeSearch(value)
    } else {
      nameSearch(value)
    }
  }

  element.parentNode.insertBefore(specialist, element.nextSibling)
  element.parentNode.insertBefore(noResults, element.nextSibling)
  element.parentNode.insertBefore(autocomplete, element.nextSibling)
  element.parentNode.insertBefore(error, element.nextSibling)
  element.addEventListener('keyup', handleSearchInput)
}
