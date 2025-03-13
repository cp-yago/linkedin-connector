// LinkedIn Connection Adder
// Script to add LinkedIn connections using iframes
const linkedInConnector = {
  // Configuration
  profileUrls: [],
  currentIndex: 0,
  delay: 2000,
  iframe: null,
  processedCount: 0,
  successCount: 0,
  alreadyConnectedCount: 0,

  // Initialize the connector
  init: function () {
    console.log("LinkedIn Connector started");
    this.createUI();
  },

  // Create the user interface
  createUI: function () {
    // Remove existing UI, if any
    const existingUI = document.getElementById("linkedin-connector-ui");
    if (existingUI) {
      existingUI.remove();
    }

    // Create the UI container
    const ui = document.createElement("div");
    ui.id = "linkedin-connector-ui";
    ui.style.cssText =
      "position: fixed; top: 20px; right: 20px; background: white; border: 1px solid #0077B5; border-radius: 8px; padding: 15px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); width: 300px; font-family: Arial, sans-serif;";

    // Title
    const title = document.createElement("h2");
    title.textContent = "LinkedIn Connector";
    title.style.cssText =
      "margin: 0 0 15px 0; color: #0077B5; font-size: 18px;";
    ui.appendChild(title);

    // Current status
    const statusDiv = document.createElement("div");
    statusDiv.id = "linkedin-connector-status";
    statusDiv.style.cssText = "margin-bottom: 15px;";
    statusDiv.innerHTML =
      "<b>Status:</b> Not started<br>" +
      "<b>Current profile:</b> 0 of 0<br>" +
      "<b>Connections sent:</b> 0<br>" +
      "<b>Already connected:</b> 0";
    ui.appendChild(statusDiv);

    // Text area for profiles
    const textArea = document.createElement("textarea");
    textArea.id = "linkedin-connector-profiles";
    textArea.placeholder = "Paste profile URLs here (one per line)";
    textArea.style.cssText =
      "width: 100%; height: 100px; margin-bottom: 15px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;";
    // Leave input empty by default
    textArea.value = "";
    ui.appendChild(textArea);

    // Buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = "display: flex; gap: 10px;";

    // Start button
    const startButton = document.createElement("button");
    startButton.textContent = "Start";
    startButton.style.cssText =
      "flex: 1; padding: 8px; background: #0077B5; color: white; border: none; border-radius: 4px; cursor: pointer;";
    startButton.onclick = () => {
      const text = textArea.value.trim();
      if (!text) {
        alert("Please paste profile URLs first.");
        return;
      }

      // Improve URL validation to accept different formats
      const profileUrls = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => {
          if (!line) return false;

          // Check if it's a LinkedIn URL
          return line.includes("linkedin.com/in/");
        });

      if (profileUrls.length === 0) {
        alert("No valid profile URLs found.");
        return;
      }

      // Reset counters
      this.processedCount = 0;
      this.successCount = 0;
      this.alreadyConnectedCount = 0;

      // Use all found profiles
      this.profileUrls = profileUrls;
      this.currentIndex = 0;
      this.startProcess();
    };
    buttonContainer.appendChild(startButton);

    // Stop button
    const stopButton = document.createElement("button");
    stopButton.textContent = "Stop";
    stopButton.style.cssText =
      "flex: 1; padding: 8px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;";
    stopButton.onclick = () => {
      this.stopProcess();
    };
    buttonContainer.appendChild(stopButton);

    ui.appendChild(buttonContainer);

    // Close button for the UI
    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.style.cssText =
      "position: absolute; top: 5px; right: 5px; background: none; border: none; cursor: pointer; font-weight: bold; color: #999;";
    closeButton.onclick = function () {
      ui.remove();
    };
    ui.appendChild(closeButton);

    // Container for the iframe
    const iframeContainer = document.createElement("div");
    iframeContainer.id = "linkedin-connector-iframe-container";
    iframeContainer.style.cssText =
      "display: none; position: fixed; bottom: 20px; right: 20px; width: 600px; height: 400px; border: 1px solid #ddd; z-index: 9998;";

    // Add the UI to the page body
    document.body.appendChild(ui);
    document.body.appendChild(iframeContainer);
  },

  // Update the status in the UI
  updateStatus: function (message) {
    const statusDiv = document.getElementById("linkedin-connector-status");
    if (statusDiv) {
      statusDiv.innerHTML =
        "<b>Status:</b> " +
        message +
        "<br>" +
        "<b>Current profile:</b> " +
        (this.currentIndex + 1) +
        " of " +
        this.profileUrls.length +
        "<br>" +
        "<b>Connections sent:</b> " +
        this.successCount +
        "<br>" +
        "<b>Already connected:</b> " +
        this.alreadyConnectedCount;
    }
    console.log("[LinkedIn Connector] " + message);
  },

  // Start the process
  startProcess: function () {
    this.updateStatus("Starting process...");

    // Create or clear the iframe container
    const iframeContainer = document.getElementById(
      "linkedin-connector-iframe-container"
    );
    iframeContainer.innerHTML = "";
    iframeContainer.style.display = "block";

    // Create the iframe
    this.iframe = document.createElement("iframe");
    this.iframe.style.cssText = "width: 100%; height: 100%; border: none;";
    iframeContainer.appendChild(this.iframe);

    // Start processing the first profile
    this.processNextProfile();
  },

  // Stop the process
  stopProcess: function () {
    this.updateStatus("Process stopped");

    // Hide the iframe
    const iframeContainer = document.getElementById(
      "linkedin-connector-iframe-container"
    );
    iframeContainer.style.display = "none";
    iframeContainer.innerHTML = "";
    this.iframe = null;
  },

  // Process the next profile
  processNextProfile: function () {
    if (this.currentIndex >= this.profileUrls.length) {
      this.updateStatus("All profiles have been processed!");
      this.stopProcess();
      return;
    }

    const currentUrl = this.profileUrls[this.currentIndex];
    this.updateStatus("Processing profile " + (this.currentIndex + 1));

    // Load the profile in the iframe
    this.iframe.src = currentUrl;

    // Wait for the iframe to load
    this.iframe.onload = () => {
      setTimeout(() => {
        this.findAndClickConnectButton();
      }, this.delay);
    };
  },

  // Find and click the connect button
  findAndClickConnectButton: function () {
    try {
      const iframeDoc =
        this.iframe.contentDocument || this.iframe.contentWindow.document;

      // Get the main element and its first section
      const mainElement = iframeDoc.querySelector("main");
      if (!mainElement) {
        this.updateStatus("Could not find main element, skipping...");
        this.moveToNextProfile();
        return;
      }

      const mainSection = mainElement.querySelector("section:first-child");
      if (!mainSection) {
        this.updateStatus("Could not find main section, skipping...");
        this.moveToNextProfile();
        return;
      }

      // First, check for direct "Connect" button in main section
      const connectButtons = Array.from(
        mainSection.querySelectorAll("button")
      ).filter((button) => {
        const text = button.textContent.trim().toLowerCase();
        return text === "connect";
      });

      if (connectButtons.length > 0) {
        this.updateStatus('Found direct "Connect" button, clicking...');
        connectButtons[0].click();

        // Wait to click the send button
        setTimeout(() => {
          this.findAndClickSendButton();
        }, this.delay);
        return;
      }

      // If no direct connect button, check for pending status
      const pendingButtons = Array.from(
        mainSection.querySelectorAll("button")
      ).filter((button) => {
        const text = button.textContent.trim().toLowerCase();
        return text === "pending";
      });

      if (pendingButtons.length > 0) {
        this.updateStatus("Connection is already pending, skipping...");
        setTimeout(() => {
          this.moveToNextProfile();
        }, this.delay);
        return;
      }

      // If no direct connect or pending button, then try the "More" button
      const moreButtons = Array.from(
        mainSection.querySelectorAll("button")
      ).filter((button) => {
        const text = button.textContent.trim().toLowerCase();
        return text === "more";
      });

      if (moreButtons.length > 0) {
        this.updateStatus('Found "More" button, checking connection status...');
        moreButtons[0].click();

        // Wait for the dropdown menu to appear and check its options
        const checkDropdownMenu = () => {
          // Look for the dropdown menu with multiple possible selectors
          const dropdownMenu = iframeDoc.querySelector(
            ".artdeco-dropdown__content-inner, " +
              '.artdeco-dropdown__content[aria-hidden="false"], ' +
              '.pvs-profile-actions__action[aria-expanded="true"]'
          );

          if (!dropdownMenu) {
            // Try to find the menu container first
            const menuContainer = iframeDoc.querySelector(
              '.artdeco-dropdown__content[role="menu"], ' +
                ".ember-view.artdeco-dropdown__content--is-open"
            );

            if (menuContainer) {
              const innerMenu = menuContainer.querySelector(
                ".artdeco-dropdown__content-inner, " +
                  "ul.artdeco-dropdown__content-inner"
              );

              if (innerMenu) {
                dropdownMenu = innerMenu;
              }
            }
          }

          if (!dropdownMenu) {
            this.updateStatus("Waiting for dropdown menu to appear...");
            if (!checkDropdownMenu.retryCount) {
              checkDropdownMenu.retryCount = 0;
            }
            if (checkDropdownMenu.retryCount < 5) {
              checkDropdownMenu.retryCount++;
              setTimeout(checkDropdownMenu, 1000);
              return;
            }
            this.moveToNextProfile();
            return;
          }

          // Get all menu items at once to analyze
          const allElements = Array.from(dropdownMenu.querySelectorAll("*"));

          // Also include direct children of the menu
          const directChildren = Array.from(dropdownMenu.children);
          allElements.push(...directChildren);

          const menuTexts = allElements.map((el) => ({
            element: el,
            text: (el.textContent || "").trim().toLowerCase(),
          }));

          // First check if we're already connected
          const removeConnectionElement = menuTexts.find(({ text }) => {
            return text.includes("remove connection");
          });

          if (removeConnectionElement) {
            this.updateStatus("Already connected to this user, skipping...");
            this.alreadyConnectedCount++;
            setTimeout(() => {
              this.moveToNextProfile();
            }, this.delay);
            return;
          }

          // Then look for connect option
          const connectElement = menuTexts.find(({ text, element }) => {
            // Check if this element or its parent is clickable
            const isClickable =
              element.tagName === "BUTTON" ||
              element.tagName === "A" ||
              element.getAttribute("role") === "button" ||
              element.classList.contains("artdeco-dropdown__item") ||
              element.classList.contains("artdeco-dropdown__option") ||
              element.parentElement.classList.contains(
                "artdeco-dropdown__item"
              ) ||
              element.parentElement.getAttribute("role") === "button" ||
              element.closest('[role="menuitem"]') !== null;

            return text.includes("connect") && isClickable;
          });

          if (connectElement) {
            this.updateStatus('Found "Connect" option in menu, clicking...');

            // Try to find the most clickable element
            const clickTarget =
              connectElement.element.closest('[role="menuitem"]') ||
              connectElement.element.closest("button") ||
              connectElement.element;

            clickTarget.click();

            setTimeout(() => {
              this.findAndClickSendButton();
            }, this.delay);
            return;
          }

          this.updateStatus("No connect option found in menu, skipping...");
          setTimeout(() => {
            this.moveToNextProfile();
          }, this.delay);
        };

        // Start checking for the dropdown menu with a longer initial delay
        setTimeout(checkDropdownMenu, 1000);
        return;
      }

      // If no More button, check for pending status directly
      this.checkPendingStatus(mainSection);
    } catch (error) {
      console.error("Error processing profile:", error);
      this.moveToNextProfile();
    }
  },

  // Check if connection is pending
  checkPendingStatus: function (mainSection) {
    try {
      // Check for direct "Pending" button in main section
      const pendingButtons = Array.from(
        mainSection.querySelectorAll("button")
      ).filter((button) => {
        const text = button.textContent.trim().toLowerCase();
        return text === "pending";
      });

      if (pendingButtons.length > 0) {
        this.updateStatus("Connection is already pending, skipping...");
        setTimeout(() => {
          this.moveToNextProfile();
        }, this.delay);
        return;
      }

      // If not pending, proceed to try to connect
      this.tryToConnect(mainSection);
    } catch (error) {
      console.error("Error checking pending status:", error);
      this.moveToNextProfile();
    }
  },

  // Try to connect with the profile
  tryToConnect: function (mainSection) {
    try {
      // Look for the "Connect" button only in the main section
      const connectButtons = Array.from(
        mainSection.querySelectorAll("button")
      ).filter((button) => {
        const text = button.textContent.trim().toLowerCase();
        return text === "connect";
      });

      if (connectButtons.length > 0) {
        this.updateStatus('Found "Connect" button, clicking...');
        connectButtons[0].click();

        // Wait to click the send button
        setTimeout(() => {
          this.findAndClickSendButton();
        }, this.delay);
        return;
      }

      // If no direct connect button, check in More menu
      const moreButtons = Array.from(
        mainSection.querySelectorAll("button")
      ).filter((button) => {
        const text = button.textContent.trim().toLowerCase();
        return text === "more";
      });

      if (moreButtons.length > 0) {
        moreButtons[0].click();

        setTimeout(() => {
          const iframeDoc =
            this.iframe.contentDocument || this.iframe.contentWindow.document;

          const moreMenuConnectButtons = Array.from(
            iframeDoc.querySelectorAll(
              'div[role="menu"] button, div.artdeco-dropdown__content button'
            )
          ).filter((button) => {
            const text = button.textContent.trim().toLowerCase();
            return text.includes("connect");
          });

          if (moreMenuConnectButtons.length > 0) {
            this.updateStatus('Found "Connect" button in menu, clicking...');
            moreMenuConnectButtons[0].click();

            // Wait to click the send button
            setTimeout(() => {
              this.findAndClickSendButton();
            }, this.delay);
          } else {
            this.updateStatus('No "Connect" button found in menu, skipping...');
            this.moveToNextProfile();
          }
        }, this.delay);
        return;
      }

      // If no connection options found
      this.updateStatus("No connection button found, skipping...");
      this.moveToNextProfile();
    } catch (error) {
      console.error("Error trying to connect:", error);
      this.moveToNextProfile();
    }
  },

  // Find and click the send button
  findAndClickSendButton: function () {
    try {
      const iframeDoc =
        this.iframe.contentDocument || this.iframe.contentWindow.document;

      // First, look for the "Send without a note" button
      const sendWithoutNoteButtons = Array.from(
        iframeDoc.querySelectorAll("button")
      ).filter((button) => {
        const text = button.textContent.trim().toLowerCase();
        return (
          text === "send without a note" || text.includes("without a note")
        );
      });

      if (sendWithoutNoteButtons.length > 0) {
        this.updateStatus('Found "Send without a note" button, clicking...');
        sendWithoutNoteButtons[0].click();

        // Increment success counter
        this.successCount++;

        // Wait before moving to the next profile
        setTimeout(() => {
          this.moveToNextProfile();
        }, this.delay);
        return;
      }

      // If "Send without a note" is not found, look for the standard "Send" button
      const sendButtons = Array.from(
        iframeDoc.querySelectorAll("button")
      ).filter((button) => {
        const text = button.textContent.trim().toLowerCase();
        return text === "send";
      });

      if (sendButtons.length > 0) {
        this.updateStatus('Found "Send" button, clicking...');
        sendButtons[0].click();

        // Increment success counter
        this.successCount++;

        // Wait before moving to the next profile
        setTimeout(() => {
          this.moveToNextProfile();
        }, this.delay);
      } else {
        this.updateStatus(
          'No "Send" or "Send without a note" button found, skipping...'
        );
        this.moveToNextProfile();
      }
    } catch (error) {
      console.error("Error sending connection:", error);
      this.moveToNextProfile();
    }
  },

  // Move to the next profile
  moveToNextProfile: function () {
    this.currentIndex++;
    this.processedCount++;

    if (this.currentIndex < this.profileUrls.length) {
      this.processNextProfile();
    } else {
      this.updateStatus(
        `All profiles have been processed! ${this.successCount} connections sent out of ${this.processedCount} profiles. ${this.alreadyConnectedCount} were already connected.`
      );
      this.stopProcess();
    }
  },
};

// Initialize the connector
linkedInConnector.init();

// Message for the user
console.log(
  "%c[LinkedIn Connector] %cScript loaded successfully!",
  "color: #0077B5; font-weight: bold",
  "color: black"
);
console.log(
  '%c[LinkedIn Connector] %cPaste your profile URLs in the text box and click "Start"',
  "color: #0077B5; font-weight: bold",
  "color: black"
);
