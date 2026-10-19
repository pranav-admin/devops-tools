
/* =========================================
   NOVA AI CHATBOT
   File: chatbot.js
========================================= */

(() => {
  // Prevent duplicate initialization
  if (document.getElementById("novaChatbot")) return;

  // Inject chatbot styles
  const chatbotStyles = document.createElement("style");

  chatbotStyles.textContent = `
    #novaChatbot * {
      box-sizing: border-box;
    }

    .nova-chat-launcher {
      position: fixed;
      right: 25px;
      bottom: 25px;
      width: 62px;
      height: 62px;
      border: none;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: #fff;
      font-size: 27px;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 8px 30px rgba(99, 102, 241, .4);
      transition: transform .25s, box-shadow .25s;
    }

    .nova-chat-launcher:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 12px 35px rgba(99, 102, 241, .55);
    }

    .nova-chat-window {
      position: fixed;
      right: 25px;
      bottom: 100px;
      width: 360px;
      height: 500px;
      max-height: calc(100dvh - 125px);
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--chat-border);
      border-radius: 20px;
      background: var(--chat-bg);
      color: var(--chat-text);
      box-shadow: 0 18px 60px rgba(0, 0, 0, .25);
      z-index: 9998;
      font-family: inherit;
      animation: novaChatEnter .25s ease;
    }

    .nova-chat-window.open {
      display: flex;
    }

    @keyframes novaChatEnter {
      from { opacity: 0; transform: translateY(12px) scale(.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .nova-chat-window {
      --chat-bg: #ffffff;
      --chat-panel: #f4f4f8;
      --chat-text: #171724;
      --chat-muted: #777789;
      --chat-border: #e5e5ee;
      --chat-bubble: #f0eff8;
      --chat-input: #ffffff;
    }

    body.dark-mode .nova-chat-window {
      --chat-bg: #171722;
      --chat-panel: #20202d;
      --chat-text: #f4f4fa;
      --chat-muted: #a2a2b6;
      --chat-border: #333345;
      --chat-bubble: #29293a;
      --chat-input: #20202d;
    }

    .nova-chat-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 17px;
      background: linear-gradient(135deg, #6d28d9, #4338ca);
      color: white;
    }

    .nova-chat-avatar {
      width: 42px;
      height: 42px;
      flex-shrink: 0;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: rgba(255, 255, 255, .18);
      font-size: 23px;
    }

    .nova-chat-heading {
      flex: 1;
      min-width: 0;
    }

    .nova-chat-heading strong {
      display: block;
      font-size: 15px;
      letter-spacing: .4px;
    }

    .nova-chat-heading small {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
      color: #e5e7ff;
      font-size: 11px;
    }

    .nova-chat-online {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4ade80;
    }

    .nova-chat-close {
      border: none;
      background: transparent;
      color: white;
      font-size: 25px;
      cursor: pointer;
      padding: 2px 5px;
    }

    .nova-chat-messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 18px 14px;
      overflow-y: auto;
      background: var(--chat-bg);
      scroll-behavior: smooth;
    }

    .nova-chat-message {
      max-width: 87%;
      display: flex;
      flex-direction: column;
      gap: 5px;
      animation: novaMessageIn .2s ease;
    }

    @keyframes novaMessageIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .nova-chat-message.bot {
      align-self: flex-start;
    }

    .nova-chat-message.user {
      align-self: flex-end;
    }

    .nova-chat-bubble {
      padding: 11px 13px;
      border-radius: 15px;
      font-size: 13px;
      line-height: 1.55;
      overflow-wrap: anywhere;
    }

    .nova-chat-message.bot .nova-chat-bubble {
      background: var(--chat-bubble);
      color: var(--chat-text);
      border-bottom-left-radius: 5px;
    }

    .nova-chat-message.user .nova-chat-bubble {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: white;
      border-bottom-right-radius: 5px;
    }

    .nova-chat-time {
      padding: 0 4px;
      color: var(--chat-muted);
      font-size: 10px;
    }

    .nova-chat-message.user .nova-chat-time {
      text-align: right;
    }

    .nova-chat-quick {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      margin-top: 3px;
    }

    .nova-chat-quick button {
      border: 1px solid #8b5cf6;
      border-radius: 20px;
      background: transparent;
      color: var(--chat-text);
      padding: 7px 10px;
      font-size: 11px;
      cursor: pointer;
      transition: background .2s, color .2s;
    }

    .nova-chat-quick button:hover {
      background: #7c3aed;
      color: white;
    }

    .nova-chat-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 14px;
      border-radius: 14px;
      background: var(--chat-bubble);
      width: fit-content;
    }

    .nova-chat-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--chat-muted);
      animation: novaTyping .8s infinite alternate;
    }

    .nova-chat-typing span:nth-child(2) {
      animation-delay: .2s;
    }

    .nova-chat-typing span:nth-child(3) {
      animation-delay: .4s;
    }

    @keyframes novaTyping {
      to { opacity: .35; transform: translateY(-3px); }
    }

    .nova-chat-form {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid var(--chat-border);
      background: var(--chat-bg);
    }

    .nova-chat-form input {
      flex: 1;
      width: 0;
      min-width: 0;
      padding: 12px;
      border: 1px solid var(--chat-border);
      border-radius: 12px;
      outline: none;
      background: var(--chat-input);
      color: var(--chat-text);
      font-family: inherit;
      font-size: 13px;
    }

    .nova-chat-form input:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, .12);
    }

    .nova-chat-send {
      width: 43px;
      min-width: 43px;
      border: none;
      border-radius: 12px;
      background: #6d28d9;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }

    .nova-chat-send:hover {
      background: #5b21b6;
    }

    .nova-chat-footer {
      padding: 0 12px 10px;
      text-align: center;
      background: var(--chat-bg);
      color: var(--chat-muted);
      font-size: 10px;
    }

    @media (max-width: 480px) {
      .nova-chat-launcher {
        right: 16px;
        bottom: 16px;
        width: 56px;
        height: 56px;
      }

      .nova-chat-window {
        right: 10px;
        bottom: 82px;
        width: calc(100vw - 20px);
        height: min(520px, calc(100dvh - 100px));
        max-height: calc(100dvh - 100px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .nova-chat-window,
      .nova-chat-message,
      .nova-chat-typing span {
        animation: none;
      }
    }
  `;

  document.head.appendChild(chatbotStyles);

  // Create chatbot interface
  const chatbot = document.createElement("div");
  chatbot.id = "novaChatbot";

  chatbot.innerHTML = `
    <button
      class="nova-chat-launcher"
      id="novaChatLauncher"
      aria-label="Open NOVA assistant"
      aria-controls="novaChatWindow"
      aria-expanded="false"
    >✦</button>

    <section
      class="nova-chat-window"
      id="novaChatWindow"
      role="dialog"
      aria-label="NOVA customer assistant"
      aria-hidden="true"
    >
      <header class="nova-chat-header">
        <div class="nova-chat-avatar">✦</div>
        <div class="nova-chat-heading">
          <strong>NOVA ASSISTANT</strong>
          <small><span class="nova-chat-online"></span> Here to help you</small>
        </div>
        <button
          class="nova-chat-close"
          id="novaChatClose"
          aria-label="Close chat"
        >&times;</button>
      </header>

      <div
        class="nova-chat-messages"
        id="novaChatMessages"
        aria-live="polite"
        aria-relevant="additions"
      ></div>

      <form class="nova-chat-form" id="novaChatForm">
        <input
          id="novaChatInput"
          type="text"
          placeholder="Ask us anything..."
          autocomplete="off"
          aria-label="Your message"
          maxlength="500"
          required
        />
        <button class="nova-chat-send" type="submit" aria-label="Send message">➤</button>
      </form>

      <div class="nova-chat-footer">
        NOVA Shopping Assistant
      </div>
    </section>
  `;

  document.body.appendChild(chatbot);

  // Elements
  const launcher = document.getElementById("novaChatLauncher");
  const windowEl = document.getElementById("novaChatWindow");
  const closeBtn = document.getElementById("novaChatClose");
  const messages = document.getElementById("novaChatMessages");
  const form = document.getElementById("novaChatForm");
  const input = document.getElementById("novaChatInput");

  // Open / close chat
  function openChat() {
    windowEl.classList.add("open");
    windowEl.setAttribute("aria-hidden", "false");
    launcher.setAttribute("aria-expanded", "true");
    launcher.textContent = "×";
    input.focus();
  }

  function closeChat() {
    windowEl.classList.remove("open");
    windowEl.setAttribute("aria-hidden", "true");
    launcher.setAttribute("aria-expanded", "false");
    launcher.textContent = "✦";
    launcher.focus();
  }

  launcher.addEventListener("click", () => {
    if (windowEl.classList.contains("open")) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeBtn.addEventListener("click", closeChat);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && windowEl.classList.contains("open")) {
      closeChat();
    }
  });

  // Safe message rendering
  function addMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `nova-chat-message ${sender}`;

    const bubble = document.createElement("div");
    bubble.className = "nova-chat-bubble";
    bubble.textContent = text;

    const time = document.createElement("div");
    time.className = "nova-chat-time";
    time.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    message.append(bubble, time);
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    return message;
  }

  function showQuickQuestions() {
    const quick = document.createElement("div");
    quick.className = "nova-chat-quick";

    const questions = [
      "What products do you sell?",
      "Shipping information",
      "Return policy",
      "Contact support"
    ];

    questions.forEach((question) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = question;

      button.addEventListener("click", () => {
        sendMessage(question);
      });

      quick.appendChild(button);
    });

    messages.appendChild(quick);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.className = "nova-chat-message bot";
    typing.id = "novaChatTyping";

    typing.innerHTML = `
      <div class="nova-chat-typing" aria-label="Assistant is typing">
        <span></span><span></span><span></span>
      </div>
    `;

    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    document.getElementById("novaChatTyping")?.remove();
  }

  // Demo responses — customize these to match your store
  function getBotReply(message) {
    const text = message.toLowerCase().trim();

    if (/\b(hi|hello|hey|namaste|good morning|good evening)\b/.test(text)) {
      return "Hey there! 👋 Welcome to NOVA. How can I help you today?";
    }

    if (
      text.includes("product") ||
      text.includes("sell") ||
      text.includes("collection") ||
      text.includes("catalog")
    ) {
      return "You can explore our latest products in the NOVA product section. Browse the collections and use the category filters to find something you love! ✨";
    }

    if (
      text.includes("price") ||
      text.includes("cost") ||
      text.includes("discount") ||
      text.includes("offer")
    ) {
      return "Our product prices and any available offers are displayed on the product cards. Browse the collection to see current prices.";
    }

    if (
      text.includes("shipping") ||
      text.includes("delivery") ||
      text.includes("deliver") ||
      text.includes("dispatch")
    ) {
      return "📦 Thanks for asking! Shipping timelines and charges haven't been configured yet. Please contact the store team for the latest delivery information.";
    }

    if (
      text.includes("return") ||
      text.includes("refund") ||
      text.includes("exchange")
    ) {
      return "↩️ For returns, refunds, or exchanges, please contact the NOVA store team. Our official return policy needs to be added before I can confirm eligibility.";
    }

    if (
      text.includes("contact") ||
      text.includes("support") ||
      text.includes("human") ||
      text.includes("email") ||
      text.includes("phone")
    ) {
      return "💬 I can help with general questions here. To speak with the store team, add your official support email or contact details to the website.";
    }

    if (
      text.includes("cart") ||
      text.includes("buy") ||
      text.includes("order") ||
      text.includes("checkout")
    ) {
      return "🛍️ Find a product you like, add it to your cart, and open the cart to review your items. The current checkout is a demo, so it won't place a real order.";
    }

    if (
      text.includes("thank")
    ) {
      return "You're welcome! 💜 Happy shopping with NOVA.";
    }

    if (
      text.includes("help") ||
      text.includes("what can you do")
    ) {
      return "I can help you explore products, understand prices, find your cart, and answer basic shipping or return questions. What would you like to know?";
    }

    return "Thanks for your message! 😊 I’m the NOVA demo assistant, so I may not know the answer to that yet. Try asking about products, prices, shipping, returns, or your cart.";
  }

  // Send a message and simulate a response
  function sendMessage(message) {
    const cleanMessage = message.trim();

    if (!cleanMessage) return;

    addMessage(cleanMessage, "user");
    input.value = "";
    input.focus();

    showTyping();

    // Demo typing delay
    window.setTimeout(() => {
      removeTyping();
      addMessage(getBotReply(cleanMessage), "bot");
    }, 650 + Math.random() * 500);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });

  // Initial welcome message
  addMessage(
    "Welcome to NOVA! ✨ I'm your shopping assistant. Ask me about products, prices, shipping, or returns.",
    "bot"
  );

  showQuickQuestions();
})();


