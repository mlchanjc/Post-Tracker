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

const storedPostIds = new Map();
const MAX_SIZE = 200;

function initMap() {
  chrome.storage.local.get(["postDetails"], ({ postDetails }) => {
    postDetails?.forEach((post) => {
      storedPostIds.set(post.id, post);
    });
  });
}

initMap();

function storePost(post) {
  const postDetail = {
    username: undefined,
    userAvatar: undefined,
    accessTime: Date.now(),
    id: undefined,
    previewText: undefined,
  };

  const hasSignedIn = !!post.querySelector(
    ".x1lliihq.x2lah0s.x1f5funs.x1n2onr6.x1bl4301.x15rks2t.x117rol3"
  );

  postDetail.userAvatar = post.querySelector("img")?.src;
  postDetail.username =
    post.querySelectorAll("a")[hasSignedIn ? 0 : 1]?.textContent;
  postDetail.id = post.querySelectorAll("a")[hasSignedIn ? 1 : 2]?.href;
  postDetail.previewText = post
    .querySelector(".x1xdureb.xkbb5z.x13vxnyz")
    ?.querySelector("span")
    ?.childNodes[0]?.textContent?.substring(0, 50);

  if (storedPostIds.size >= MAX_SIZE) {
    // Get the first entry (oldest) from the Map
    const oldestKey = storedPostIds.keys().next().value;
    storedPostIds.delete(oldestKey); // Remove the oldest entry
  }

  storedPostIds.set(postDetail.id, postDetail);
  chrome.storage.local.set(
    { postDetails: Array.from(storedPostIds.values()) },
    undefined
  );
}

const threadsPostSelector =
  ".x1ypdohk.x1n2onr6.xvuun6i.x3qs2gp.x1w8tkb5.x8xoigl.xz9dl7a.xsag5q8";

function checkPosts() {
  const posts = document.querySelectorAll(threadsPostSelector);
  posts.forEach(storePost);
}

const handleScroll = () => {
  checkPosts();
};

const debouncedScroll = debounce(handleScroll, 300);

window.addEventListener("scroll", debouncedScroll);
