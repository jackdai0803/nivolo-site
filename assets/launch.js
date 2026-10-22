(function () {
  "use strict";

  var form = document.getElementById("launchForm");
  var input = document.getElementById("launchEmail");
  var submit = document.getElementById("launchSubmit");
  var status = document.getElementById("launchStatus");
  var success = document.getElementById("launchSuccess");

  if (!form || !input || !submit || !status || !success) return;

  function showSuccess() {
    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get("joined") === "1") {
    showSuccess();
    history.replaceState(null, "", window.location.pathname);
  } else if (params.has("error")) {
    status.textContent = params.get("error") === "busy"
      ? "A few too many signups arrived at once. Please try again in a minute."
      : "That didn\u2019t go through. Please check your email and try again.";
    status.className = "launch-status is-error";
    history.replaceState(null, "", window.location.pathname);
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    submit.disabled = true;
    submit.querySelector("span").textContent = "Joining\u2026";
    status.textContent = "";
    status.className = "launch-status";

    try {
      var response = await fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          email: input.value,
          company: document.getElementById("launchCompany").value,
        }),
      });
      var result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "signup_failed");
      showSuccess();
    } catch (error) {
      status.textContent = error.message === "rate_limited"
        ? "A few too many signups arrived at once. Please try again in a minute."
        : "That didn\u2019t go through. Please try once more, or email support@nivolo.app.";
      status.className = "launch-status is-error";
      submit.disabled = false;
      submit.querySelector("span").textContent = "Email me when it\u2019s out";
      input.focus();
    }
  });
})();
