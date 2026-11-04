(function () {
  "use strict";

  var form = document.getElementById("launchForm");
  var startedAt = Date.now();
  var startedInput = document.getElementById("launchStarted");
  if (startedInput) startedInput.value = startedAt;
  var input = document.getElementById("launchEmail");
  var submit = document.getElementById("launchSubmit");
  var status = document.getElementById("launchStatus");
  var success = document.getElementById("launchSuccess");
  var help = document.getElementById("launchHelp");
  var savedEmail = document.getElementById("launchSavedEmail");
  var edit = document.getElementById("launchEdit");
  var removal = document.getElementById("launchRemoval");
  var copy = document.getElementById("launchCopy");
  var copyStatus = document.getElementById("launchCopyStatus");
  var card = document.getElementById("launchCard");
  var intro = document.getElementById("launchIntro");
  var artNote = document.getElementById("launchArtNote");
  var receipt = document.getElementById("launchReceipt");
  var copyTimer;
  var pending = false;

  var strings = {
    en: {
      join: "Join the launch list", joining: "Joining…", help: "Need a hand?",
      copy: "Copy address", copied: "Copied", manual: "Please select and copy support@nivolo.app above.",
      back: "Back to Nivolo", another: "Use another email",
      remove: "To remove a previous address, email", saved: "{email}",
      waiting: "Nivo is waiting too.", welcomed: "Good things start small.",
      reserved: "A little spot, just for you", successTitle: "You’re on the list.",
      successNote: "Nivo’s saving you a place. We’ll send one email when Nivolo is ready for your iPhone.",
      delivery: "Your launch note will go to", promise: "Just the launch. No newsletters. Pinky promise.",
      offline: "Looks like you’re offline. Your email is still in the box — try again when you’re back.",
      network: "We couldn’t connect. Your email is still in the box — check your connection and try again.",
      unconfirmed: "We couldn’t confirm your signup. Your email is still in the box — please try again shortly.",
      busy: "A few too many signups arrived at once. Your email is still in the box — please try again in a minute.",
      redirectBusy: "A few too many signups arrived at once. Please try again in a minute.",
      invalid: "Please check your email address and try again.",
      incomplete: "That email looks incomplete. Please check the address before joining.",
    },
    zh: {
      join: "加入上线通知名单", joining: "正在加入…", help: "需要帮助？",
      copy: "复制邮箱地址", copied: "已复制", manual: "请选中并复制上方的 support@nivolo.app。",
      back: "返回 Nivolo", another: "使用其他邮箱",
      remove: "如需移除之前的邮箱，请联系", saved: "{email}",
      waiting: "Nivo 也在等你。", welcomed: "美好，从一小步开始。",
      reserved: "为你留了一个小位置", successTitle: "你已加入名单。",
      successNote: "Nivo 为你留好了位置。Nivolo iPhone 版准备好时，我们会发一封邮件告诉你。",
      delivery: "上线通知将发送至", promise: "只发上线通知，不发通讯。拉钩。",
      offline: "你好像离线了。邮箱地址仍保留在输入框中，联网后再试一次吧。",
      network: "暂时无法连接。邮箱地址仍保留在输入框中，请检查网络后重试。",
      unconfirmed: "暂时无法确认是否加入成功。邮箱地址仍保留在输入框中，请稍后再试。",
      busy: "目前加入的人有点多。邮箱地址仍保留在输入框中，请一分钟后再试。",
      redirectBusy: "目前加入的人有点多，请一分钟后再试。",
      invalid: "请检查邮箱地址后再试一次。",
      incomplete: "邮箱地址好像还没填完整，检查一下再加入吧。",
    },
  };
  var t = function (key) { return strings[document.documentElement.lang.startsWith("zh") ? "zh" : "en"][key]; };

  if (!form || !input || !submit || !status || !success) return;

  document.querySelectorAll("[data-launch-copy]").forEach(function (element) {
    element.textContent = t(element.dataset.launchCopy);
  });
  edit.hidden = false;
  // Keep native validation when JavaScript is unavailable.
  form.noValidate = true;
  var emailTouched = false;
  var validationError = false;
  function updateEmailFeedback() {
    var valid = input.value.trim() !== "" && input.checkValidity();
    input.setAttribute("aria-invalid", emailTouched && !valid ? "true" : "false");
    if (validationError && valid) {
      status.textContent = "";
      status.className = "launch-status";
      help.hidden = true;
      validationError = false;
    }
  }
  input.addEventListener("blur", function () { emailTouched = true; updateEmailFeedback(); });
  input.addEventListener("input", updateEmailFeedback);

  function showSuccess(email, instant) {
    savedEmail.textContent = email ? t("saved").replace("{email}", function () { return email; }) : "";
    savedEmail.hidden = !email;
    receipt.hidden = !email;
    removal.hidden = false;
    intro.hidden = true;
    card.classList.add("is-joined");
    card.setAttribute("aria-labelledby", "launch-success-title");
    artNote.textContent = t("welcomed");
    form.hidden = true;
    success.hidden = false;
    success.focus({ preventScroll: true });
    // Bring Nivo back into view after submitting below the mobile keyboard.
    if (card.getBoundingClientRect().top < 0) card.scrollIntoView({ block: "start", behavior: "instant" });
    if (!instant && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      card.classList.add("is-celebrating");
      success.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300, easing: "ease-out" });
      success.querySelector(".launch-success-mark").animate([{ transform: "scale(.9)" }, { transform: "scale(1.06)", offset: .65 }, { transform: "scale(1)" }], { duration: 360, easing: "ease-out" });
    }
  }

  function showError(key) {
    status.textContent = t(key);
    status.className = "launch-status is-error";
    help.hidden = false;
  }

  edit.addEventListener("click", function () {
    success.hidden = true;
    form.hidden = false;
    intro.hidden = false;
    card.classList.remove("is-joined", "is-celebrating");
    card.setAttribute("aria-labelledby", "launch-title");
    artNote.textContent = t("waiting");
    // Adding a different address does not remove one already saved.
    input.focus();
    input.select();
  });

  copy.addEventListener("click", async function () {
    clearTimeout(copyTimer);
    copy.textContent = t("copy");
    try {
      await navigator.clipboard.writeText("support@nivolo.app");
      copy.textContent = t("copied");
      copyStatus.textContent = t("copied");
      copyTimer = setTimeout(function () {
        copy.textContent = t("copy");
        copyStatus.textContent = "";
      }, 2000);
    } catch {
      copyStatus.textContent = t("manual");
    }
  });

  var params = new URLSearchParams(window.location.search);
  if (params.get("joined") === "1") {
    showSuccess(null, true);
    history.replaceState(null, "", window.location.pathname);
  } else if (params.has("error")) {
    showError(params.get("error") === "busy" ? "redirectBusy" : "invalid");
    history.replaceState(null, "", window.location.pathname);
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (pending) return;
    emailTouched = true;
    updateEmailFeedback();
    if (!input.checkValidity()) {
      validationError = true;
      showError("incomplete");
      input.focus();
      return;
    }
    if (navigator.onLine === false) {
      showError("offline");
      return;
    }

    pending = true;
    submit.disabled = true;
    submit.querySelector("span").textContent = t("joining");
    form.setAttribute("aria-busy", "true");
    status.textContent = "";
    status.className = "launch-status";
    help.hidden = true;
    copyStatus.textContent = "";
    // Confirm the address actually submitted, even if the field is edited
    // before the request finishes. Match the server's normalisation.
    var email = input.value.trim().toLowerCase();
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 12000);

    try {
      var response = await fetch(form.action, {
        method: "POST",
        signal: controller.signal,
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          company: document.getElementById("launchCompany").value,
          started: startedAt,
        }),
      });
      if (response.status === 429) throw new Error("rate_limited");
      var result;
      try { result = await response.json(); }
      catch { throw new Error("unconfirmed"); }
      if (!response.ok || result?.ok !== true) throw new Error(result?.error || "unconfirmed");
      showSuccess(email);
    } catch (error) {
      showError(navigator.onLine === false ? "offline"
        : error instanceof TypeError ? "network"
        : error.message === "rate_limited" ? "busy"
        : error.message === "invalid_email" ? "invalid" : "unconfirmed");
      input.focus();
    } finally {
      clearTimeout(timeout);
      pending = false;
      form.removeAttribute("aria-busy");
      submit.disabled = false;
      submit.querySelector("span").textContent = t("join");
    }
  });
})();
