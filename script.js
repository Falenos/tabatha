async function save() {
  const activeTab = await getActiveTab();
  if (!activeTab) {
    // console.log("No Active tab");
    alert("No Active tab. Please select a tab and try again.");
    return;
  }
  // console.log("Active tab:", activeTab);
  const { groupId } = activeTab;
  const grouped = groupId && groupId !== -1;

  const tabs = await chrome.tabs.query({ groupId, active: false });
  // console.log("Group tabs:", tabs.length, tabs);

  const bookmarksFolder = await getBookmarksFolder(grouped, groupId);
  // console.log("Bookmarks folder:", bookmarksFolder);

  try {
    await Promise.all(
      tabs.map((tab) => createAndKill(tab, bookmarksFolder))
    );
    await createAndKill(activeTab, bookmarksFolder);
    if (grouped) {
      await closeGroup(groupId);
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
}

async function getActiveTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getBookmarksFolder(grouped, groupId) {
  const title = grouped
    ? (await chrome.tabGroups.get(groupId)).title
    : new Date().toLocaleString();
  const folder = await chrome.bookmarks.create({ title });
  if (chrome.runtime.lastError) {
    throw new Error(chrome.runtime.lastError.message);
  }
  return folder;
}

async function createAndKill(tab, bookmarksFolder) {
  await chrome.bookmarks.create({
    parentId: bookmarksFolder.id,
    title: tab.title,
    url: tab.url,
  });
  await chrome.tabs.remove(tab.id);
  if (chrome.runtime.lastError) {
    throw new Error(chrome.runtime.lastError.message);
  }
}

async function closeGroup(groupId) {
  const activeTabGroup = await chrome.tabGroups.get(groupId);
  // console.log("Closing active tab group:", activeTabGroup);
  await chrome.tabGroups.close(activeTabGroup, true);
  if (chrome.runtime.lastError) {
    throw new Error(chrome.runtime.lastError.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("save-tabs-btn").addEventListener("click", save);
});