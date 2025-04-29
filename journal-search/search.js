
// Loading display toggle
let loadingContainer;
function setDisplayLoading(value) {
	if (!loadingContainer) {
		loadingContainer = createLoadingSpinner();
	}
	if (value) {
		searchButton.remove();
		searchContainer.append(loadingContainer);
	} else {
		loadingContainer.remove();
		searchContainer.append(searchButton)
	}
}

// Search action
async function onSearch() {
	const term = searchInput ? searchInput.value : null;
	if (term && term.length > 2) {
		setDisplayLoading(true);
		const results = await getSearchResults(term);
		setDisplayLoading(false);
		displayResults(term, results);
	}
}

// Fetch results
async function getSearchResults(term) {
	let results = [];

	const user = window.location.pathname.split('/')[2];
	if (user) {
		let next_url = `profile/shares?characterName=${user}`;

		try {
			while(next_url) {
				const response = await fetch(`https://api.fallenlondon.com/api/${next_url}`);
				const data = await response.json();

				results = [
					...results,
					...data.shares.filter((share) => {
						return (
							share.eventName.toLowerCase().includes(term.toLowerCase()) ||
							share.playerMessage.toLowerCase().includes(term.toLowerCase())
						);
					}),
				];

				next_url = data.next;
			}
		} catch (error) {
			console.error(error);
		}
		
	}

	return results;
}

// Highlight our result text
function highlightText(element, term) {
	const highlighter = new Mark(element);
	highlighter.mark(term, { 
		"element": 'span', 
		"each": (el) => { el.style = 'background-color: #fcac00;'},
	});
}

// Display results
let originalResultList;
let list;
function displayResults(term, results) {
	if (!originalResultList) {
		originalResultList = document.querySelector('.journal-entries');
	}
	originalResultList.remove();
	if (list) {
		list.remove();
	}

	list = createResultsList(results, clearResults);

	if (!originalResultList) {
		originalResultList = document.querySelector('.journal-entries');
	}
	originalResultList.remove();

	const journalContainer = document.querySelector('.journal-entries-container');
	journalContainer.insertBefore(
		list, 
		journalContainer.childNodes[1]
	);

	highlightText(document.querySelector('.journal-entries'), term)
}

// Reset list to original entries
function clearResults() {
	list.remove()
	const journalContainer = document.querySelector('.journal-entries-container');
	journalContainer.insertBefore(
		originalResultList, 
		journalContainer.childNodes[1]
	);
	searchInput.value = '';
}

// Create search form
const [
	searchContainer, 
	searchInput, 
	searchButton
] = createSearchForm(onSearch);

// Add search form to journal controls when they load on the page
var observer = new MutationObserver(function(mutations) {
	journalControls = document.querySelector('.journal-entries__header-and-controls');
	if (journalControls) {
		journalControls.append(searchContainer);
		observer.disconnect();
	}
});
observer.observe(document.body, {
    childList: true,
    subtree: true,
});