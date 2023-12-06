# Tabatha

Tabatha is a Chrome extension that allows you to group your tabs and store them in a bookmarks directory with the same name.
In case you use it for ungrouped tabs, the folder name is the bookmarks directory will be the date and time.

## Installation

To install the extension, follow these steps:

1. Clone the repository.
2. Open Google Chrome and navigate to the extensions page by typing `chrome://extensions` in the address bar.
3. Turn on the "Developer mode" toggle in the top right corner of the page.
4. Click the "Load unpacked" button in the top left corner of the page.
5. Navigate to the directory where the extension files are located and select the folder.
6. Once the extension is loaded, you should see a new icon in the top right corner of the browser window.

## Usage

With this plugin, using as a base you `current tab`, you can take the group that you tab is in, and store it as a folder in bookmarks,
with all its tabs, while closing the group. In my case they are under the `other bookmarks` section
When you use it for `ungrouped` tabs, the folder name is the bookmarks directory will be the date and time.
In case your window contains groups and some ungrouped tabs, the calculation is based on the current active tab.
If it is grouped we store the whole group, if it is ungrouped we store all the ungrouped.
Finally, if you click the button and you already have a bookmarks folder with the same name, its contents will be overwritten with the current group tabs.

TIP: from your bookmarks bar, the opposite is possible.
You right click on a folder, and you can open all its tabs in all possible ways, including in a new group.
For some reason the group option is not available from your chrome://bookmarks/ page at the moment.

To recap, these are the steps:

1. Make sure you are in the correct tab
2. Click the extension icon in the top right corner of the browser window.
3. Click the "Save Tabs" button to save your tab group.
4. To view your new bookmarks folder, check your bookmarks. It is going to be at the top level or under "Other bookmarks".

## Contributing

Contributions are welcome! To contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE Version 3 - see the [LICENSE](LICENSE) file for details.