function createLoadingSpinner() {
	const loadingContainer = document.createElement('div');
	loadingContainer.className = 'loading-image';
	loadingContainer.style = 'margin-left: 1rem;';

	const loadingImage = document.createElement('img');
	loadingImage.src = '/static/media/oval.be00fc4a.svg';
	loadingImage.className = 'loading-spinner loading-spinner--small';
	loadingImage.alt = 'Loading';
	loadingImage.style = 'height: 13px;';
	loadingImage.classnames = 'fade';
	loadingContainer.append(loadingImage);

	return loadingContainer;
}

function createSearchForm(onSearchClick) {
	const searchContainer = document.createElement('div');
	searchContainer.style = 'flex-grow: 1;justify-content: flex-end;display: flex;'

	const searchInput = document.createElement('input');
	searchInput.type = 'text';
	searchInput.placeholder = 'Search journal entries';
	searchInput.id = 'fl_journal_search_term';
	searchInput.minLength = '3';
	searchContainer.append(searchInput);

	const searchButton = document.createElement('button');
	searchButton.className = 'button--primary';
	searchButton.onclick = onSearchClick;
	searchButton.textContent = 'Search';
	searchButton.style = 'margin-left: 1rem;cursor: pointer;'
	searchContainer.append(searchButton);

	return [searchContainer, searchInput, searchButton]
}

function createResultEntry(result) {
	const entryContainer = document.createElement('div');
	entryContainer.className = 'journal-entry';
	entryContainer.style = 'margin-bottom: 16px;';

	const mediaContainer = document.createElement('div');
	mediaContainer.className = 'media__body';
	entryContainer.append(mediaContainer);

	const buttonlet = document.createElement('div');
	buttonlet.className = 'journal-entry__buttonlet';
	mediaContainer.append(buttonlet);
	const buttonletContainer = document.createElement('span');
	buttonletContainer.className = 'profile__contacts-container';
	buttonlet.append(buttonletContainer);
	const buttonletTooltip = document.createElement('div');
	buttonletTooltip.id = `linkTooltip_${result.id}`;
	buttonletTooltip.className = 'profile__contacts-alert';
	buttonletTooltip.style = 'visibility: hidden; color: rgb(239, 239, 239);';
	buttonletTooltip.textContent = 'Link copied to clipboard!';
	buttonletContainer.append(buttonletTooltip);
	const buttonletIcon = document.createElement('i');
	buttonletIcon.className = 'link--inverse journal-entry__permalink fa fa-link heading--1';
	buttonletIcon.onclick = () => {
		const user = window.location.pathname.split('/')[2];
		const postLink = `${window.location.origin}/profile/${user}/${result.id}`;
		navigator.clipboard.writeText(postLink);

		buttonletTooltip.style = "visibility: visible; color: rgb(239, 239, 239);", setTimeout((function() {
			buttonletTooltip && (buttonletTooltip.style = "visibility: hidden; color: rgb(239, 239, 239);")
	    }), 1e3)
	}
	buttonletContainer.append(buttonletIcon);

	const heading = document.createElement('h4');
	heading.className = 'heading heading--2 heading--inverse journal-entry__title';
	heading.textContent = result.eventName;
	mediaContainer.append(heading);

	const subheading = document.createElement('h2');
	subheading.className = 'media__heading heading heading--3 journal-entry__date-and-location';
	mediaContainer.append(subheading);
	const subheadingDate = document.createElement('span');
	subheadingDate.className = 'journal-entry__date';
	subheadingDate.textContent = result.fallenLondonDateTime;
	subheading.append(subheadingDate);
	const subheadingLocation = document.createElement('span');
	subheadingLocation.className = 'journal-entry__location';
	subheadingLocation.textContent = `(${result.areaName})`
	subheading.append(subheadingLocation);

	const bodyText = document.createElement('div');
	bodyText.className = 'journal-entry__body';
	bodyText.innerHTML = result.playerMessage;
	mediaContainer.append(bodyText);

	return entryContainer;
}

function createResultsList(results, resetView) {
	const entryList = document.createElement('div');
	
	const clearLink = document.createElement('button');
	clearLink.className = 'button--link';
	clearLink.textContent = 'Clear Results';
	clearLink.style = 'margin-bottom: 16px;';
	clearLink.onclick = resetView;
	entryList.append(clearLink);

	entryList.className = 'journal-entries';
	results.forEach((result) => {
		entryList.append(createResultEntry(result));
	});
	return entryList;
}