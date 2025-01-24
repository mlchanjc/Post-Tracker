const postList = document.getElementById("postList");

const fuseOptions = {
  includeScore: true,
  threshold: 0.3,
  keys: ["username"],
};

let searchText = "";

function displayPosts() {
  chrome.storage.local.get(["postDetails"], ({ postDetails }) => {
    postList.innerHTML = ""; // Clear previous posts

    if (!!!postDetails) return;

    const fuse = new Fuse(postDetails, fuseOptions);

    if (searchText !== "")
      postDetails = fuse.search(searchText).map((result) => result.item);

    postDetails.forEach((post) => {
      const postDiv = document.createElement("div");
      postDiv.className = "post";

      const avatarImg = document.createElement("img");

      avatarImg.src = post.userAvatar || "placeholder-avatar.png"; // Use a placeholder if no avatar
      avatarImg.className = "avatar";

      const contentDiv = document.createElement("div");
      contentDiv.className = "content";

      const usernameDiv = document.createElement("div");
      usernameDiv.className = "username";
      usernameDiv.textContent = post.username;

      const timeDiv = document.createElement("div");
      timeDiv.className = "time";
      timeDiv.textContent = new Date(post.accessTime).toLocaleString();

      const previewTextDiv = document.createElement("div");
      previewTextDiv.className = "preview-text";
      previewTextDiv.textContent = post.previewText;

      contentDiv.appendChild(usernameDiv);
      contentDiv.appendChild(timeDiv);
      contentDiv.appendChild(previewTextDiv);
      postDiv.appendChild(avatarImg);
      postDiv.appendChild(contentDiv);
      postList.appendChild(postDiv);
    });
  });
}

displayPosts();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.postDetails) {
    displayPosts();
  }
});

document.getElementById("search").addEventListener("input", (event) => {
  searchText = event.target.value;
  displayPosts();
});
