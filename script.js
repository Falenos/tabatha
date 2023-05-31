async function getActiveTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function save() {
  const activeTab = await getActiveTab();
  if (!activeTab || !activeTab.groupId || activeTab.groupId === -1) {
    // console.log('No Active tab or no group:', activeTab);
    return;
  }
  // console.log('Active tab:', activeTab);

  const tabs = await chrome.tabs.query({ groupId: activeTab.groupId });
  // console.log('Group tabs:', tabs);

  const activeGroup = await chrome.tabGroups.get(activeTab.groupId);
  // console.log('Active group:', activeGroup);

  const bookmarksFolderName = activeGroup.title;
  // console.log('Bookmarks folder name:', bookmarksFolderName);

  const bookmarksFolder = await chrome.bookmarks.create({ title: bookmarksFolderName });
  // console.log('Bookmarks folder:', bookmarksFolder);

  for (const tab of tabs) {
    // console.log('Creating bookmark for tab:', tab);
    await chrome.bookmarks.create({ parentId: bookmarksFolder.id, title: tab.title, url: tab.url });
    // console.log('Removing tab:', tab);
    await chrome.tabs.remove(tab.id);
  }
  // console.log('Closing active tab group:', activeTabGroup);
  await chrome.tabGroups.close(activeTabGroup, true);

}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveTabsButton').addEventListener('click', save);
});

