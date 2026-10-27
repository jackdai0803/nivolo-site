(function () {
  "use strict";

  var form = document.getElementById("launchForm");
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
  var copyTimer;
  var pending = false;

  var strings = {
    en: {
      join: "Join the launch list", joining: "Joining…", help: "Need a hand?",
      copy: "Copy address", copied: "Copied", manual: "Please select and copy support@nivolo.app above.",
      back: "Back to Nivolo", another: "Use another email",
      remove: "To remove a previous address, email", saved: "We’ll write to {email}.",
      offline: "Looks like you’re offline. Your email is still in the box — try again when you’re back.",
      network: "We couldn’t connect. Your email is still in the box — check your connection and try again.",
      unconfirmed: "We couldn’t confirm your signup. Your email is still in the box — please try again shortly.",
      busy: "A few too many signups arrived at once. Your email is still in the box — please try again in a minute.",
      redirectBusy: "A few too many signups arrived at once. Please try again in a minute.",
      invalid: "Please check your email address and try again.",
    },
    zh: {
      join: "加入上线通知名单", joining: "正在加入…", help: "需要帮助？",
      copy: "复制邮箱地址", copied: "已复制", manual: "请选中并复制上方的 support@nivolo.app。",
      back: "返回 Nivolo", another: "使用其他邮箱",
      remove: "如需移除之前的邮箱，请联系", saved: "我们会发送邮件至 {email}。",
      offline: "你好像离线了。邮箱地址仍保留在输入框中，联网后再试一次吧。",
      network: "暂时无法连接。邮箱地址仍保留在输入框中，请检查网络后重试。",
      unconfirmed: "暂时无法确认是否加入成功。邮箱地址仍保留在输入框中，请稍后再试。",
      busy: "目前加入的人有点多。邮箱地址仍保留在输入框中，请一分钟后再试。",
      redirectBusy: "目前加入的人有点多，请一分钟后再试。",
      invalid: "请检查邮箱地址后再试一次。",
    },
  };
  var t = function (key) { return strings[document.documentElement.lang.startsWith("zh") ? "zh" : "en"][key]; };

  if (!form || !input || !submit || !status || !success) return;

  document.querySelectorAll("[data-launch-copy]").forEach(function (element) {
    element.textContent = t(element.dataset.launchCopy);
  });
  edit.hidden = false;

  function showSuccess(email) {
    savedEmail.textContent = email ? t("saved").replace("{email}", function () { return email; }) : "";
    savedEmail.hidden = !email;
    removal.hidden = false;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  function showError(key) {
    status.textContent = t(key);
    status.className = "launch-status is-error";
    help.hidden = false;
  }

  edit.addEventListener("click", function () {
    success.hidden = true;
    form.hidden = false;
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
    showSuccess();
    history.replaceState(null, "", window.location.pathname);
  } else if (params.has("error")) {
    showError(params.get("error") === "busy" ? "redirectBusy" : "invalid");
    history.replaceState(null, "", window.location.pathname);
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
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
