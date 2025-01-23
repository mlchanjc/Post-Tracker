const commentList = document.getElementById("commentList");

const options = {
	includeScore: true,
	threshold: 0.3,
	keys: ["username"],
};

function fuzzySearch(query) {
	return fuse.search(query).map((result) => result.item.name);
}

let searchText = "";

// Function to display comments
function displayComments() {
	chrome.storage.local.get(["postDetails"], ({ postDetails }) => {
		commentList.innerHTML = ""; // Clear previous comments

		if (!!!postDetails) return;

		const fuse = new Fuse(postDetails, options);

		postDetails = fuse.search(searchText).map((result) => result.item.username);

		postDetails.forEach((post) => {
			const commentDiv = document.createElement("div");
			commentDiv.className = "comment";

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
			commentDiv.appendChild(avatarImg);
			commentDiv.appendChild(contentDiv);
			commentList.appendChild(commentDiv);
		});
	});
}

displayComments();

chrome.storage.onChanged.addListener((changes, area) => {
	if (area === "local" && changes.postDetails) {
		displayComments();
	}
});

document.getElementById("search").addEventListener("input", (event) => {
	searchText = event.target.value;
	displayComments();
});
