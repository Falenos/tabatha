class NoActiveTabError extends Error {
  constructor(message) {
    super(message);
    this.name = "NoActiveTabError";
  }
}

class BookmarkCreationError extends Error {
  constructor(message) {
    super(message);
    this.name = "BookmarkCreationError";
  }
}

class ClearBookmarksFolderError extends Error {
  constructor(message) {
    super(message);
    this.name = "ClearBookmarksFolderError";
  }
}
async function save() {
  try {
    const activeTab = await getActiveTab();
    const { groupId } = activeTab;
    const grouped = groupId && groupId !== -1;

    const title = grouped
      ? (await chrome.tabGroups.get(groupId)).title
      : new Date().toLocaleString();

    let bookmarksFolder =
      (await getBookmarksFolderByTitle(title)) ||
      (await createBookmarksFolder(title));

    await clearBookmarksFolder(bookmarksFolder);

    const tabs = await chrome.tabs.query({ groupId, active: false });
    await Promise.all(
      tabs.map((tab) => saveTabToBookmarks(tab, bookmarksFolder))
    );

    await saveTabToBookmarks(activeTab, bookmarksFolder);

    if (grouped) {
      await closeTabGroup(groupId);
    }
  } catch (error) {
    handleSaveError(error);
  }
}

async function clearBookmarksFolder(bookmarksFolder) {
  try {
    const existingBookmarks = await chrome.bookmarks.getChildren(
      bookmarksFolder.id
    );

    for (const bookmark of existingBookmarks) {
      await chrome.bookmarks.remove(bookmark.id);

      if (chrome.runtime.lastError) {
        throw new ClearBookmarksFolderError(chrome.runtime.lastError.message);
      }
    }
  } catch (error) {
    throw new ClearBookmarksFolderError(
      `Error clearing bookmarks folder: ${error.message}`
    );
  }
}

async function createBookmark(tab, bookmarksFolder) {
  try {
    await chrome.bookmarks.create({
      parentId: bookmarksFolder.id,
      title: tab.title,
      url: tab.url,
    });

    if (chrome.runtime.lastError) {
      throw new BookmarkCreationError(chrome.runtime.lastError.message);
    }
  } catch (error) {
    throw new BookmarkCreationError(
      `Error creating bookmark: ${error.message}`
    );
  }
}

async function getActiveTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);

  if (!tab) {
    throw new NoActiveTabError(
      "No Active tab. Please select a tab and try again."
    );
  }

  return tab;
}

async function getBookmarksFolderByTitle(title) {
  try {
    const existingFolders = await chrome.bookmarks.search({ title });
    return existingFolders.length > 0 ? existingFolders[0] : null;
  } catch (error) {
    throw new Error(`Error searching for bookmarks folder: ${error.message}`);
  }
}

async function createBookmarksFolder(title) {
  try {
    const folder = await chrome.bookmarks.create({ title });
    return folder;
  } catch (error) {
    throw new Error(`Error creating bookmarks folder: ${error.message}`);
  }
}

async function saveTabToBookmarks(tab, bookmarksFolder) {
  try {
    // if (!(await doesBookmarkExist(tab, bookmarksFolder))) {
    await createBookmark(tab, bookmarksFolder);
    // }

    await closeTab(tab);
  } catch (error) {
    throw new Error(`Error saving tab to bookmarks: ${error.message}`);
  }
}

// async function doesBookmarkExist(tab, bookmarksFolder) {
//   try {
//     const query = {
//       title: tab.title,
//       url: tab.url,
//       parentId: bookmarksFolder.id,
//     };

//     const existingBookmarks = await chrome.bookmarks.search(query);

//     return existingBookmarks.length > 0;
//   } catch (error) {
//     throw new Error(`Error checking if bookmark exists: ${error.message}`);
//   }
// }

async function closeTab(tab) {
  await chrome.tabs.remove(tab.id);

  if (chrome.runtime.lastError) {
    throw new Error(chrome.runtime.lastError.message);
  }
}

async function closeTabGroup(groupId) {
  const activeTabGroup = await chrome.tabGroups.get(groupId);
  await chrome.tabGroups.close(activeTabGroup, true);

  if (chrome.runtime.lastError) {
    throw new Error(chrome.runtime.lastError.message);
  }
}

function handleSaveError(error) {
  if (error instanceof NoActiveTabError) {
    alert(error.message);
  } else if (
    error instanceof BookmarkCreationError ||
    error instanceof ClearBookmarksFolderError
  ) {
    console.error(error);
    alert(error.message);
  } else {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("save-tabs-btn").addEventListener("click", save);
});
