function debounce(func, delay) {
	let timeoutId;

	return function (...args) {
		const context = this;

		// Clear the previous timeout on each call
		clearTimeout(timeoutId);

		// Set a new timeout
		timeoutId = setTimeout(() => {
			func.apply(context, args);
		}, delay);
	};
}

function getThreadsPostContainer() {
	return new Promise((resolve, reject) => {
		const check = setInterval(() => {
			const postContainer = document.querySelector(threadsPostContainerSelector);
			if (postContainer) {
				clearInterval(check);
				resolve(postContainer);
			}
		}, 100);
	});
}

const storedPostIds = new Map();
const MAX_SIZE = 200;

function storePost(post) {
	const postDetail = {
		username: undefined,
		userAvatar: undefined,
		accessTime: Date.now(),
		id: undefined,
		previewText: undefined,
	};

	postDetail.userAvatar = post.querySelector("img")?.src;
	postDetail.username = post.querySelectorAll("a")[0]?.textContent;
	postDetail.id = post.querySelectorAll("a")[1]?.href;
	postDetail.previewText = post.querySelector(".x1xdureb.xkbb5z.x13vxnyz")?.textContent?.substring(0, 50);

	if (storedPostIds.size >= MAX_SIZE) {
		// Get the first entry (oldest) from the Map
		const oldestKey = storedPostIds.keys().next().value;
		storedPostIds.delete(oldestKey); // Remove the oldest entry
	}

	storedPostIds.set(postDetail.id, postDetail);
	chrome.storage.local.set({ postDetails: Array.from(storedPostIds.values()) }, () => {
		console.log("Post stored:", postDetail);
	});
}

const threadsPostContainerSelector = "x78zum5.xdt5ytf.x1iyjqo2.x1n2onr6";
const threadsPostSelector = ".x1ypdohk.x1n2onr6.xvuun6i.x3qs2gp.x1w8tkb5.x8xoigl.xz9dl7a.xsag5q8";

function checkPosts() {
	console.log("Checking posts...");

	const posts = document.querySelectorAll(threadsPostSelector);
	posts.forEach(storePost);
}

/* 	const observer = new MutationObserver(checkPosts);
	const postContainer = document.querySelector(threadsPostContainerSelector);
	observer.observe(postContainer, { childList: true, subtree: false }); */

const handleScroll = () => {
	checkPosts();
};

const debouncedScroll = debounce(handleScroll, 300);

window.addEventListener("scroll", debouncedScroll);
