var searchInput = document.querySelector('#search_input')
var search = document.querySelector('#search')
var reset = document.querySelector('#reset')
var statusFilter = null
function getCharacters(query) {
  fetch(`https://rickandmortyapi.com/api/character${query ? `?name=${query}` : ''}${query && statusFilter ? `&status=${statusFilter}` : !query && statusFilter ? `?status=${statusFilter}` : ''}`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    createCards(data.results)
  })
  .catch(err => console.log(err))
}

function createCards(data) {
  var container = document.querySelector('#cards')
  container.innerHTML = ''
  for (var i = 0; i < data.length; i++) {
    var card = document.createElement('div')
    card.classList.add('col-span-2')
    card.classList.add('sm:col-span-1')
    card.innerHTML = /*html*/`
      <div class="flex bg-slate-700 rounded-lg text-white">
        <img class="object-cover rounded-l-lg w-36" src="${data[i].image}" />
        <div class="p-2 flex-grow overflow-hidden">
          <div class="flex space-x-2 items-center w-full">
            <div class="flex-shrink-0 w-3 h-3 rounded-full ${data[i].status === 'Alive' ? 'bg-green-400' : 'bg-red-400'}"></div>
            <p class="text-lg truncate font-bold">${data[i].name}</p>
          </div>
          <div class="flex space-x-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 flex-shrink-0 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="truncate">${data[i].location.name}</p>
          </div>
          <div class="flex space-x-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 flex-shrink-0 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <p class="truncate">${data[i].species}</p>
          </div>
        </div>
      </div>
    `
    container.appendChild(card)
  }
}

getCharacters()
setSearching(false)
document.addEventListener('keydown', function(e) {
  if (e.key === '/') {
    e.preventDefault()
    searchInput.focus()
  }
})

var input = ''
var isSearching = false
function setSearching(bool) {
  if (bool === isSearching) return
  if (bool) {
    search.innerHTML = /*html*/`
        <svg aria-label="Loading" class="animate-spin h-6 w-6" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-opacity="0.25" [attr.stroke-width]="stroke" vector-effect="non-scaling-stroke"></circle>
          <path d="M15 8a7.002 7.002 0 00-7-7" stroke="currentColor" [attr.stroke-width]="stroke" stroke-linecap="round" vector-effect="non-scaling-stroke"></path>
        </svg>
    ` } else {
      search.innerHTML = /*html*/`
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ` }
}

var timeout;
searchInput.addEventListener('keyup', function(e) {
  var searchValue = e.target.value
  input = searchValue
  if (input) {
    reset.innerHTML = /*html*/`
      <div id="reset-button" class="p-0.5 bg-slate-600 rounded-full text-slate-400 cursor-pointer hover:bg-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ` 
    document.querySelector('#reset-button').addEventListener('click', function() {
      searchInput.value = ''
      getCharacters()
      setSearching(false)
      reset.innerHTML = ''
      searchInput.focus()
    })
  } else {
    reset.innerHTML = ''
  }
  if (searchValue) {
    clearTimeout(timeout)
    setSearching(true)
    isSearching = true
    timeout = setTimeout(function() {
      getCharacters(searchValue)
      setSearching(false)
      isSearching = false
    }, 500)
  }
})

document.querySelector('#status-filter').addEventListener('click', function(e) {
  if (statusFilter === 'Alive') {
    statusFilter = 'Dead'
    document.querySelector('#status-filter-text').textContent = 'Searching for Dead Characters'
  } else {
    statusFilter = 'Alive'
    document.querySelector('#status-filter-text').textContent = 'Searching for Alive Characters'
  }
  if (statusFilter) {
      document.querySelector('#clear-status').innerHTML = /*html*/`
      <div id="clear-status-button" class="p-0.5 bg-slate-600 rounded-full text-slate-400 cursor-pointer hover:bg-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    `
    document.querySelector('#clear-status-button').addEventListener('click', function(e) {
      e.stopPropagation()
      statusFilter = ''
      document.querySelector('#status-filter-text').textContent = 'Add Status Filter'
      document.querySelector('#clear-status').innerHTML = ''
      document.querySelector('#status-filter-indicator').classList = `w-2 h-2 rounded-full ${!statusFilter ? 'bg-slate-400' : statusFilter === 'Alive' ? 'bg-green-400' : 'bg-red-400'}`
      getCharacters()
    })
  }
  getCharacters(input)
  document.querySelector('#status-filter-indicator').classList = `w-2 h-2 rounded-full ${!statusFilter ? 'bg-slate-400' : statusFilter === 'Alive' ? 'bg-green-400' : 'bg-red-400'}`
})
document.querySelector('#status-filter-indicator').classList = `w-2 h-2 rounded-full ${!statusFilter ? 'bg-slate-400' : statusFilter === 'Alive' ? 'bg-green-400' : 'bg-red-400'}`
