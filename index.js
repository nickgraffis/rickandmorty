var loading = true
var searchInput = document.querySelector('#search_input')
var search = document.querySelector('#search')
var reset = document.querySelector('#reset')
var statusFilterEl = document.querySelector('#status-filter')
var resetButtonEl;
var statusFilterText = document.querySelector('#status-filter-text')
var clearStatusEl = document.querySelector('#clear-status')
var statusFilterIndicatorEl = document.querySelector('#status-filter-indicator')
var locationFilterEl = document.querySelector('#location-filter')
var locationFilterText = document.querySelector('#location-filter-text')
var locationFilter = ''
var statusFilter = null

function stopLoading () {
  document.querySelector('#body').classList.toggle('hidden')
  loading = false
  document.querySelector('#loading').classList.toggle('hidden')
}
function getCharacters(query, page) {
  if (allCharecters?.length > 800) {
    return Promise.resolve(
      allCharecters.filter(charecter => {
        let filters = []
        if (query) filters.push(charecter.name.toLowerCase().includes(query.toLowerCase()))
        if (locationFilter) filters.push(charecter.location.name.toLowerCase().includes(locationFilter.toLowerCase()))
        if (statusFilter) filters.push(charecter.status.toLowerCase() === statusFilter)
        return filters.every(filter => filter)
      }).slice(0, 20)
    )
  } else {
    return fetch(`https://rickandmortyapi.com/api/character${query ? `?name=${query}` : ''}${query && statusFilter ? `&status=${statusFilter}` : !query && statusFilter ? `?status=${statusFilter}` : ''}${query && page ? `&page=${page}` : !query && page ? `?page=${page}` : ''}`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      return data.results
    })
    .catch(err => console.log(err))
  }
}

function getLocations(query) {
  return fetch(`https://rickandmortyapi.com/api/location${query ? `?name=${query}` : ''}`)
  .then(res => res.json())
  .then(data => {
    return data
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
        <div class="relative w-36 h-full bg-green-300 rounded-l-lg">
          <img class="object-cover rounded-l-lg w-36 relative z-50" src="${data[i].image}" />
        </div>
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
function debounce(func, ms) {
  clearTimeout(timeout)
  timeout = setTimeout(func, ms)
}

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
    resetButtonEl = document.querySelector('#reset-button')
    resetButtonEl.addEventListener('click', function() {
      searchInput.value = ''
      getCharacters().then(data => createCards(data))
      setSearching(false)
      reset.innerHTML = ''
      searchInput.focus()
    })
  } else {
    reset.innerHTML = ''
  }
  if (searchValue) {
    setSearching(true)
    isSearching = true
    debounce(function() {
      getCharacters(searchValue).then(data => createCards(data))
      setSearching(false)
      isSearching = false
    }, 500)
  }
})

statusFilterEl.addEventListener('click', function(e) {
  if (statusFilter === 'Alive') {
    statusFilter = 'Dead'
    statusFilterText.textContent = 'Searching for Dead Characters'
  } else {
    statusFilter = 'Alive'
    statusFilterText.textContent = 'Searching for Alive Characters'
  }
  if (statusFilter) {
      clearStatusEl.innerHTML = /*html*/`
      <div id="clear-status-button" class="p-0.5 bg-slate-600 rounded-full text-slate-400 cursor-pointer hover:bg-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    `
    document.querySelector('#clear-status-button').addEventListener('click', function(e) {
      e.stopPropagation()
      statusFilter = ''
      statusFilterText.textContent = 'Add Status Filter'
      clearStatusEl.innerHTML = ''
      statusFilterIndicatorEl.classList = `w-2 h-2 rounded-full ${!statusFilter ? 'bg-slate-400' : statusFilter === 'Alive' ? 'bg-green-400' : 'bg-red-400'}`
      getCharacters().then(data => createCards(data))
    })
  }
  getCharacters(input).then(data => createCards(data))
  statusFilterIndicatorEl.classList = `w-2 h-2 rounded-full ${!statusFilter ? 'bg-slate-400' : statusFilter === 'Alive' ? 'bg-green-400' : 'bg-red-400'}`
})
statusFilterIndicatorEl.classList = `w-2 h-2 rounded-full ${!statusFilter ? 'bg-slate-400' : statusFilter === 'Alive' ? 'bg-green-400' : 'bg-red-400'}`

var selectedLocation = -1;
var locations = []
function fillInLocations() {
  document.querySelector('#location-filter-list').innerHTML = ''
  for (let i = 0; i < locations.results.length; i++) {
    let location = locations.results[i]
    document.querySelector('#location-filter-list').innerHTML += /*html*/`
      <li id="item-${i}" class="px-2 py-1 hover:bg-slate-600 rounded-md cursor-pointer">
        <p class="text-slate-200">${location.name}</p>
      </li>
    `
  }
}
let clearLocationEventListener
locationFilterEl.addEventListener('click', function() {
  document.querySelector('#location-filter-popover').classList.toggle('hidden')
  document.querySelector('#location-filter-input').focus()
  document.querySelector('#location-filter-input').addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        locationFilter = locations.results[selectedLocation].name
        locationFilterText.textContent = locationFilter
        document.querySelector('#location-filter-input').value = ''
        selectedLocation = 0
        document.querySelector('#location-filter-popover').classList.toggle('hidden')
        getCharacters().then(data => {
          console.log(locationFilter, data)
          createCards(data)
        })
      } else if (e.key === 'ArrowDown') {
        fillInLocations()
        if (selectedLocation < locations.results.length - 1) {
          selectedLocation++
          is(
            document.querySelector('#location-filter-list'),
            document.querySelector(`#item-${selectedLocation}`),
            { scroll: true }
          )
          document.querySelector('#item-' + selectedLocation).classList.toggle('bg-slate-400')
        } else {
          selectedLocation = 0
          is(
            document.querySelector('#location-filter-list'),
            document.querySelector(`#item-${selectedLocation}`),
            { scroll: true }
          )
          document.querySelector('#item-' + selectedLocation).classList.toggle('bg-slate-400')
        }
      } else if (e.key === 'ArrowUp') {
        fillInLocations()
        if (selectedLocation > 0) {
          selectedLocation--
          is(
            document.querySelector('#location-filter-list'),
            document.querySelector(`#item-${selectedLocation}`),
            { scroll: true }
          )
          document.querySelector('#item-' + selectedLocation).classList.toggle('bg-slate-400')
        } else {
          selectedLocation = locations.length - 1
          is(
            document.querySelector('#location-filter-list'),
            document.querySelector(`#item-${selectedLocation}`),
            { scroll: true }
          )
          document.querySelector('#item-' + selectedLocation).classList.toggle('bg-slate-400')
        }
      } else {
        debounce(function() {
          getLocations(e.target.value)
          .then(returnedLocations => {
            locations = returnedLocations
            document.querySelector('#clear-location').innerHTML = /*html*/`
              <div id="clear-location-button" class="p-0.5 bg-slate-600 rounded-full text-slate-400 cursor-pointer hover:bg-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            `
            removeEventListener('click', clearLocationEventListener)
            clearLocationEventListener = document.querySelector('#clear-location-button').addEventListener('click', function(e) {
              e.stopPropagation()
              locationFilter = ''
              locationFilterText.textContent = 'Add Location Filter'
              document.querySelector('#clear-location').innerHTML = ''
              getCharacters().then(data => createCards(data))
            })
            fillInLocations()
          })
        }, 500)
      }
  })
})


var allCharecters = []
function backgroundLoadAllCharectersIntoMemory() {
  if (localStorage.getItem('rick_and_morty_characters')) {
    allCharecters = JSON.parse(localStorage.getItem('rick_and_morty_characters'))
    return Promise.resolve(allCharecters)
  } else {
    let total = 826
    let perPage = 20
    let pages = Math.ceil(total / perPage)
    let promises = []
    for (let i = 0; i < pages; i++) {
      promises.push(getCharacters(null, i))
    }
    return Promise.all(promises)
    .then(function(results) {
      results.forEach(result => {
        allCharecters = allCharecters.concat(result)
        localStorage.setItem('rick_and_morty_characters', JSON.stringify(allCharecters))
      })
    }).catch(function(err) {
      console.log('err', err)
    })
  }
}

backgroundLoadAllCharectersIntoMemory().then(_ => {
  stopLoading()
  getCharacters().then(data => createCards(data))
})

function is(parent, child, options) {
  let parentTop = parent.getBoundingClientRect().top;
  let parentBottom = parent.offsetHeight;
  let childTop = child.getBoundingClientRect().top;
  let childHeight = child.getBoundingClientRect().height;
  let startOfChild = childTop - parentTop;
  let endOfElement = startOfChild + childHeight;
  if (options?.scroll && endOfElement > parentBottom) {
    parent.scrollBy({
      top: endOfElement - parentBottom + (options?.buffer || 0),
      behavior: 'smooth',
    });
    // parent.scrollTop =
    //   parent.scrollTop + (endOfElement - parentBottom) + (options?.buffer || 0);
  } else if (options?.scroll && startOfChild < 0) {
    parent.scrollBy({
      top: startOfChild - (options?.buffer || 0),
      behavior: 'smooth',
    });
    // parent.scrollTop = parent.scrollTop + startOfChild - (options?.buffer || 0);
  }
  return endOfElement > parentBottom || startOfChild < 0;
}