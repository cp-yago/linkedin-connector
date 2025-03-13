# 🤖 LinkedIn Connector

Automate LinkedIn connections and save hours of manual work!

## 💡 Motivation

I received a long list of amazing professionals to connect with on LinkedIn. Cool! But then I thought:

> "Man, this is going to take forever to add everyone manually... 😩"

So, I turned this problem into a solution! I developed this script to automate the process and save valuable time. Now, instead of spending hours clicking, you can add connections in seconds. 😉

This project was built **entirely with JavaScript** and refined with the help of **Claude 3.5**.

## ✨ Features

- 🚀 **Automatically processes multiple profiles**
- 🎯 **Intelligently detects** the "Connect" button, no matter where it is:
  - Directly on the profile page
  - Inside the "More" menu
  - Skipping profiles already in your network
  - Avoiding pending connection requests
- 📊 **User-friendly interface** with real-time status updates:
  - Operation progress
  - Connections sent
  - Profiles already connected
  - Detailed status of each action

## 🚀 How to Use

1. Open [LinkedIn](https://www.linkedin.com/) in your browser
2. Press `F12` to open **Developer Tools**
3. Go to the `"Console"` tab
4. **Paste the contents** of the `linkedin_connector.js` file
5. Press `Enter` to **run the script**
6. A small interface will appear in the top-right corner
7. **Paste LinkedIn profile URLs** (one per line)
8. Click `"Start"` and relax! 😎

### 📝 Accepted URL Formats

The script supports URLs in the following formats:

- `https://www.linkedin.com/in/profile-name`
- `linkedin.com/in/profile-name`
- `www.linkedin.com/in/profile-name`

## 📊 Real-Time Progress Tracking

While the script runs, it displays:

✔ **Current operation status**  
✔ **Profile being processed**  
✔ **Number of connections sent**  
✔ **Profiles already connected**

## ⚠️ Important Notes

1. **Use in moderation!** LinkedIn has daily connection limits
2. The script **simulates human behavior** to avoid being flagged
3. It automatically skips:
   - Profiles already in your network
   - Pending connection requests
   - Profiles without a connect option

## 🛠️ Limitations

- Works only with **public profiles** or **2nd/3rd-degree connections**
- **Requires you to be logged in** to LinkedIn
- May stop working if **LinkedIn updates its interface**

## 🤔 Issues?

If the script stops working, it’s likely because:

1. **LinkedIn changed** something in its interface
2. You’ve **hit the daily connection limit**
3. Your **internet connection** is unstable

If this happens, stop the script, wait a bit, and try again.

---

**Remember**: Use this script responsibly! The goal is to **automate a repetitive process**, not to **spam** the network. 😊
