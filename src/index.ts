import { Search } from 'js-search'
import franchisee from './data/franchisee.json'

const search = new Search('title')

search.addIndex(['names'])
search.addIndex('zones')

search.addDocuments(franchisee)

const handleSearchInput = ({ currentTarget }: KeyboardEvent): void => {
  const { value } = <HTMLInputElement>currentTarget
  console.log(search.search(value))
}

document.getElementById('search').addEventListener('keyup', handleSearchInput)
