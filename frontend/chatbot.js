// chat.js
// Requires an HTML structure with:
//   <div id="chat-window"></div>
//   <input type="text" id="user-input" placeholder="Type your message…" />
//   <button id="send-button">Send</button>

document.addEventListener("DOMContentLoaded", () => {
  const chatWindow = document.getElementById("chat-window");
  const inputField = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");

  // Holds the thread ID returned by the backend after the first message
  let currentThreadId = null;

  // Helper: append a chat bubble (sender = "user" or "bot")
  function appendChatBubble(sender, text) {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", sender === "user" ? "user" : "bot");
    bubble.textContent = text;
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Helper: render follow-up questions as a bullet list
  function renderFollowUpQuestions(questions) {
    const container = document.createElement("div");
    container.classList.add("bot-followup-container");
    const header = document.createElement("div");
    header.classList.add("followup-header");
    header.textContent = "🔸 I need a bit more information:";
    container.appendChild(header);

    const ul = document.createElement("ul");
    ul.classList.add("followup-list");
    questions.forEach((q) => {
      const li = document.createElement("li");
      li.textContent = q;
      ul.appendChild(li);
    });
    container.appendChild(ul);
    chatWindow.appendChild(container);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Helper: show an emergency banner
  function showEmergencyBanner(message) {
    const banner = document.createElement("div");
    banner.classList.add("emergency-banner");
    banner.textContent = message;
    chatWindow.appendChild(banner);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Helper: render a list of possible conditions
  function renderConditionList(conditions) {
    const container = document.createElement("div");
    container.classList.add("conditions-container");
    const header = document.createElement("div");
    header.classList.add("conditions-header");
    header.textContent = "Possible conditions:";
    container.appendChild(header);

    const ul = document.createElement("ul");
    ul.classList.add("conditions-list");
    conditions.forEach((cond) => {
      const li = document.createElement("li");
      li.textContent = cond;
      ul.appendChild(li);
    });
    container.appendChild(ul);
    chatWindow.appendChild(container);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Main function: handles sending the user's message and processing the response
  async function handleAiConversation() {
    const userInput = inputField.value.trim();
    if (userInput === "") return;

    // 1. Append the user’s message to the chat window
    appendChatBubble("user", userInput);
    inputField.value = "";

    // 2. Send POST to /triage API
    let response;
    try {
      response = await fetch("https://triagecall.vercel.app/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          thread_id: currentThreadId,
        }),
      });
    } catch (err) {
      appendChatBubble("bot", "Network error. Please check your connection and try again.");
      return;
    }

    if (!response.ok) {
      appendChatBubble("bot", "Server error. Please try again later.");
      return;
    }

    let data;
    try {
      data = await response.json();
    } catch (err) {
      appendChatBubble("bot", "Invalid response from server.");
      return;
    }

    // 3. Save the returned thread ID for subsequent calls (if provided)
    if (data.thread_id) {
      currentThreadId = data.thread_id;
    }

    // 4. If there are follow-up questions, render them and stop
    if (Array.isArray(data.follow_up_questions) && data.follow_up_questions.length > 0) {
      renderFollowUpQuestions(data.follow_up_questions);
      return;
    }

    // 5. If this is an emergency (send_sos === true), show banner + conditions
    if (data.send_sos === true) {
      showEmergencyBanner("🚨 This looks like a medical emergency—please call 112 or go to the nearest ER now.");
      if (Array.isArray(data.possible_conditions) && data.possible_conditions.length > 0) {
        renderConditionList(data.possible_conditions);
      }
      return;
    }

    // 6. Otherwise, just display the normal bot text (if any)
    if (data.text && data.text.length > 0) {
      appendChatBubble("bot", data.text);
    }
  }

  // Event listeners: click on Send button or press Enter in input field
  sendButton.addEventListener("click", handleAiConversation);
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAiConversation();
    }
  });
});
// chat.js
// Requires an HTML structure with:
//   <div id="chat-window"></div>
//   <input type="text" id="user-input" placeholder="Type your message…" />
//   <button id="send-button">Send</button>

document.addEventListener("DOMContentLoaded", () => {
  const chatWindow = document.getElementById("chat-window");
  const inputField = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");

  // Holds the thread ID returned by the backend after the first message
  let currentThreadId = null;

  // Helper: append a chat bubble (sender = "user" or "bot")
  function appendChatBubble(sender, text) {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", sender === "user" ? "user" : "bot");
    bubble.textContent = text;
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Helper: render follow-up questions as a bullet list
  function renderFollowUpQuestions(questions) {
    const container = document.createElement("div");
    container.classList.add("bot-followup-container");
    const header = document.createElement("div");
    header.classList.add("followup-header");
    header.textContent = "🔸 I need a bit more information:";
    container.appendChild(header);

    const ul = document.createElement("ul");
    ul.classList.add("followup-list");
    questions.forEach((q) => {
      const li = document.createElement("li");
      li.textContent = q;
      ul.appendChild(li);
    });
    container.appendChild(ul);
    chatWindow.appendChild(container);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Helper: show an emergency banner
  function showEmergencyBanner(message) {
    const banner = document.createElement("div");
    banner.classList.add("emergency-banner");
    banner.textContent = message;
    chatWindow.appendChild(banner);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Helper: render a list of possible conditions
  function renderConditionList(conditions) {
    const container = document.createElement("div");
    container.classList.add("conditions-container");
    const header = document.createElement("div");
    header.classList.add("conditions-header");
    header.textContent = "Possible conditions:";
    container.appendChild(header);

    const ul = document.createElement("ul");
    ul.classList.add("conditions-list");
    conditions.forEach((cond) => {
      const li = document.createElement("li");
      li.textContent = cond;
      ul.appendChild(li);
    });
    container.appendChild(ul);
    chatWindow.appendChild(container);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Main function: handles sending the user's message and processing the response
  async function handleAiConversation() {
    const userInput = inputField.value.trim();
    if (userInput === "") return;

    // 1. Append the user’s message to the chat window
    appendChatBubble("user", userInput);
    inputField.value = "";

    // 2. Send POST to /triage API
    let response;
    try {
      response = await fetch("https://triagecall.vercel.app/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          thread_id: currentThreadId,
        }),
      });
    } catch (err) {
      appendChatBubble("bot", "Network error. Please check your connection and try again.");
      return;
    }

    if (!response.ok) {
      appendChatBubble("bot", "Server error. Please try again later.");
      return;
    }

    let data;
    try {
      data = await response.json();
    } catch (err) {
      appendChatBubble("bot", "Invalid response from server.");
      return;
    }

    // 3. Save the returned thread ID for subsequent calls (if provided)
    if (data.thread_id) {
      currentThreadId = data.thread_id;
    }

    // 4. If there are follow-up questions, render them and stop
    if (Array.isArray(data.follow_up_questions) && data.follow_up_questions.length > 0) {
      renderFollowUpQuestions(data.follow_up_questions);
      return;
    }

    // 5. If this is an emergency (send_sos === true), show banner + conditions
    if (data.send_sos === true) {
      showEmergencyBanner("🚨 This looks like a medical emergency—please call 112 or go to the nearest ER now.");
      if (Array.isArray(data.possible_conditions) && data.possible_conditions.length > 0) {
        renderConditionList(data.possible_conditions);
      }
      return;
    }

    // 6. Otherwise, just display the normal bot text (if any)
    if (data.text && data.text.length > 0) {
      appendChatBubble("bot", data.text);
    }
  }

  // Event listeners: click on Send button or press Enter in input field
  sendButton.addEventListener("click", handleAiConversation);
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAiConversation();
    }
  });
});
