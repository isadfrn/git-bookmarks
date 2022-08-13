function getGithubInfo(username) {
    const baseUrl = `https://api.github.com/users/${username}`;

    return fetch(baseUrl)
    .then(response => response.json())
    .then(({login, name, public_repos, followers}) => ({
        login, name, public_repos, followers
    }));
}

function showErrorMsg(msg) {
    const containerDiv = document.querySelector('.container');
    
    containerDiv.insertAdjacentHTML('beforeend',
    `
    <div class="bookmarked__error">
        <span class="bookmarked__error--text">${msg}</span>
    </div>
    `
    )

    setTimeout(() => {
        const bookmarkedError = document.querySelector('.bookmarked__error');
        containerDiv.removeChild(bookmarkedError);
    }, 7000);
}

function update() {
    const bookmarkedDiv = document.querySelector('.bookmarked');
    const bookmarkedBody = document.querySelector('.bookmarked__body');
    const tableContent = JSON.parse(window.localStorage.getItem('tableContent'));

    if (tableContent === null) {
        window.localStorage.setItem('tableContent', JSON.stringify([]));
    } else {
        if (tableContent.length === 0) {
            bookmarkedBody.innerHTML = "";
            const bookmarkedEmpty = document.createElement('div');
            bookmarkedEmpty.classList.add('bookmarked__empty');
    
            bookmarkedDiv.appendChild(bookmarkedEmpty);
    
            bookmarkedEmpty.insertAdjacentHTML('beforeend',
            `
            <img 
                class="bookmarked__empty--star"
                src="./assets/img/star-empty.svg" 
                alt="A sad star"
            />
            <span>No bookmarks yet</span>
            `);
        } else {
            const bookmarkedEmpty = document.querySelector('.bookmarked__empty');
            if (bookmarkedEmpty) {
                bookmarkedDiv.removeChild(bookmarkedEmpty);
                renderTable();
            } else {
                renderTable();
            }
            
        }
    }
}

function renderTable() {
    const bookmarkedDiv = document.querySelector('.bookmarked');
    const bookmarkedBody = document.querySelector('.bookmarked__body');

    const bookmarkedBodyDiv = document.createElement('div');
    bookmarkedBodyDiv.classList.add('bookmarked__body');

    if (bookmarkedBody === undefined) {
        bookmarkedDiv.appendChild(bookmarkedBodyDiv);
    } else {
        bookmarkedBody.innerHTML = "";
    }

    const tableContent = JSON.parse(window.localStorage.getItem('tableContent'));
    
    tableContent.map((item, index) => {
        bookmarkedBody.insertAdjacentHTML('beforeend', `
        <div class="bookmarked__body__row" data-index="${index}">
            <a href="https://github.com/${item.login}" class="bookmarked__body__row__user">
                <img
                    class="bookmarked__body__row__user--img"
                    src="https://github.com/${item.login}.png"
                    alt="${item.name}"
                />
                <div class="bookmarked__body__row__user__text">
                    <span class="bookmarked__body__row__user__text--name">${item.name}</span>
                    <span class="bookmarked__body__row__user__text--git">/${item.login}</span>
                </div>
            </a>
            <span class="bookmarked__body__row__repositories">${item.public_repos}</span>
            <span class="bookmarked__body__row__followers">${item.followers}</span>
            <button class="bookmarked__body__row__remove">Remove</button>
        </div>
        `)
    });
}

function addFavorite(githubInfo) {
    let usernameAlreadyExists = false;

    const tableContent = JSON.parse(window.localStorage.getItem('tableContent'));

    tableContent.map((item) => {
        if (githubInfo.login === item.login) {
            usernameAlreadyExists = true;
        }
    });

    if (usernameAlreadyExists) {
        showErrorMsg("Username already on favorites list");
    } else {
        tableContent.push(githubInfo);
        window.localStorage.setItem('tableContent', JSON.stringify(tableContent));
        update();
    }
}

function removeFavorite(event) {
    const clickedElement = event.target;
    const parentElement = clickedElement.parentElement;
    const index = parentElement.dataset.index;
    const tableContent = JSON.parse(window.localStorage.getItem('tableContent'));

    tableContent.splice(index, 1);
    window.localStorage.setItem('tableContent', JSON.stringify(tableContent));

    update();
}

async function onSubmit(event) {
    event.preventDefault();

    const githubUsername = event.target[0].value;
    const githubInfo = await getGithubInfo(githubUsername);

    if (githubInfo.name === undefined) {
        showErrorMsg("GitHub username was not found");
    } else {
        addFavorite(githubInfo);
        update();
        renderTable();
    }
}

function addClickEvents(event) {
    const isButton = event.target.nodeName === 'BUTTON';
    if (!isButton) {
        return;
    } else {
        removeFavorite(event);
    }
}

update();

const searchForm = document.querySelector('.search__form');
const bookmarkedBody = document.querySelector('.bookmarked__body');

searchForm.addEventListener('submit', onSubmit);
bookmarkedBody.addEventListener('click', addClickEvents);
