let bookmarkRepositories = [];

async function setBookmarkedItem() {
  event.preventDefault();
  const typedUsername = event.target[0].value;
  const userInfo = await getGithubData(typedUsername);
  bookmarkRepositories = [...bookmarkRepositories, userInfo];
  console.log(bookmarkRepositories);
}

function getGithubData(username) {
  const endpoint = `https://api.github.com/users/${username.toLowerCase()}`;
  return fetch(endpoint)
    .then((response) => response.json())
    .then(({ login, name, public_repos, followers }) => ({
      login,
      name,
      public_repos,
      followers,
    }));
}

const bookmarkForm = document.querySelector('.bookmark__form');

bookmarkForm.addEventListener('submit', setBookmarkedItem);
