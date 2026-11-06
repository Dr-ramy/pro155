/**
 * feedback-engine.js
 * محرك التغذية الراجعة الذكية والتعزيز المعرفي
 */

const FeedbackEngine = {
  showToast(message, type = "info") {
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3";
      toastContainer.style.zIndex = "9999";
      document.body.appendChild(toastContainer);
    }

    const bgClass = type === "success" ? "bg-success text-white" :
                    type === "warning" ? "bg-warning text-dark" :
                    type === "danger" ? "bg-danger text-white" : "bg-primary text-white";

    const toastId = "toast_" + Date.now();
    const html = `
      <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body small fw-semibold">
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;

    toastContainer.insertAdjacentHTML("beforeend", html);
    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
    toast.show();
  }
};
